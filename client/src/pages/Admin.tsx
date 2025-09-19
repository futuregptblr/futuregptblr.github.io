import { useEffect, useMemo, useState } from 'react';
import { apiAdminLogin, apiCloudinarySign, apiCreateTeamMember, apiDeleteTeamMember, apiGetTeam, apiUpdateTeamMember } from '../lib/api';
import type { TeamMember } from '../types';

export default function AdminPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('adminToken'));
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<(TeamMember & { _id?: string }) | null>(null);
  const [form, setForm] = useState<{
    name: string;
    role: string;
    designation: string;
    chapter: string;
    bio: string;
    linkedin: string;
    github: string;
    website: string;
    order: number;
    image: string;
    file?: File | null;
  }>({
    name: '',
    role: '',
    designation: '',
    chapter: '',
    bio: '',
    linkedin: '',
    github: '',
    website: '',
    order: 0,
    image: '',
    file: null,
  });

  useEffect(() => {
    if (!token) return;
    (async () => {
      const data = await apiGetTeam();
      setTeam(data);
    })();
  }, [token]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await apiAdminLogin({ email, password });
      setToken(res.token);
      localStorage.setItem('adminToken', res.token);
    } catch (e: any) {
      setError(e?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(file: File): Promise<string> {
    if (!token) throw new Error('Not authed');
    const sign = await apiCloudinarySign(token, { folder: 'futuregpt/team' });

    const form = new FormData();
    form.append('file', file);
    form.append('api_key', sign.apiKey);
    form.append('timestamp', String(sign.timestamp));
    form.append('folder', sign.folder);
    form.append('signature', sign.signature);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${sign.cloudName}/image/upload`, {
      method: 'POST',
      body: form,
    });
    if (!res.ok) throw new Error('Upload failed');
    const json = await res.json();
    return json.secure_url as string;
  }

  function openForm(existing?: (TeamMember & { _id?: string }) | null) {
    setEditing(existing || null);
    setForm({
      name: existing?.name || '',
      role: existing?.role || '',
      designation: existing?.designation || '',
      chapter: existing?.chapter || '',
      bio: existing?.bio || '',
      linkedin: (existing as any)?.linkedin || '',
      github: (existing as any)?.github || '',
      website: (existing as any)?.website || '',
      order: (existing as any)?.order ?? 0,
      image: existing?.image || '',
      file: null,
    });
    setIsFormOpen(true);
  }

  async function submitForm(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    setLoading(true);
    setError(null);
    try {
      let imageUrl = form.image;
      if (form.file) {
        imageUrl = await handleUpload(form.file);
      }
      const payload: any = {
        name: form.name,
        role: form.role,
        designation: form.designation,
        chapter: form.chapter,
        bio: form.bio,
        linkedin: form.linkedin || undefined,
        github: form.github || undefined,
        website: form.website || undefined,
        order: form.order,
        image: imageUrl,
      };
      if (editing && (editing as any)._id) {
        const updated = await apiUpdateTeamMember(token, (editing as any)._id, payload);
        setTeam(t => t.map(m => ((m as any)._id === (editing as any)._id ? updated : m)));
      } else {
        const created = await apiCreateTeamMember(token, payload);
        setTeam(t => [created, ...t]);
      }
      setIsFormOpen(false);
      setEditing(null);
    } catch (e: any) {
      setError(e?.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(member: TeamMember) {
    if (!token || !(member as any)._id) return;
    if (!window.confirm('Delete this member?')) return;
    await apiDeleteTeamMember(token, (member as any)._id);
    setTeam(t => t.filter(m => (m as any)._id !== (member as any)._id));
  }

  if (!token) {
    return (
      <div className="pt-20 max-w-md mx-auto px-4">
        <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input className="w-full border px-3 py-2 rounded" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input className="w-full border px-3 py-2 rounded" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          {error && <p className="text-red-600">{error}</p>}
          <button disabled={loading} className="bg-black text-white px-4 py-2 rounded">{loading ? 'Signing in...' : 'Sign In'}</button>
        </form>
      </div>
    );
  }

  return (
    <div className="pt-20 max-w-5xl mx-auto px-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin: Team Manager</h1>
        <div className="space-x-2">
          <button className="bg-gray-200 px-3 py-2 rounded" onClick={async () => setTeam(await apiGetTeam())}>Refresh</button>
          <button className="bg-black text-white px-3 py-2 rounded" onClick={() => openForm(null)}>Add Member</button>
          <button className="bg-red-600 text-white px-3 py-2 rounded" onClick={() => { setToken(null); localStorage.removeItem('adminToken'); }}>Logout</button>
        </div>
      </div>

      {isFormOpen && (
        <form onSubmit={submitForm} className="mb-8 border rounded p-4 bg-white">
          <h2 className="text-lg font-semibold mb-3">{editing ? 'Edit Member' : 'Add Member'}</h2>
          {error && <p className="text-red-600 mb-2">{error}</p>}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-700 mb-1">Name</label>
              <input className="w-full border px-3 py-2 rounded" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Role</label>
              <input className="w-full border px-3 py-2 rounded" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} required />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Designation</label>
              <input className="w-full border px-3 py-2 rounded" value={form.designation} onChange={e => setForm(f => ({ ...f, designation: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Chapter</label>
            <select
              className="w-full border px-3 py-2 rounded bg-white"
              value={form.chapter}
              onChange={e => setForm(f => ({ ...f, chapter: e.target.value }))}
            >
              <option value="">Select a chapter</option>
              <option value="Global">Global</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Pune">Pune</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Chennai">Chennai</option>
            </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-700 mb-1">Bio</label>
              <textarea className="w-full border px-3 py-2 rounded" rows={3} value={form.bio} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">LinkedIn</label>
              <input className="w-full border px-3 py-2 rounded" value={form.linkedin} onChange={e => setForm(f => ({ ...f, linkedin: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">GitHub</label>
              <input className="w-full border px-3 py-2 rounded" value={form.github} onChange={e => setForm(f => ({ ...f, github: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Website</label>
              <input className="w-full border px-3 py-2 rounded" value={form.website} onChange={e => setForm(f => ({ ...f, website: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm text-gray-700 mb-1">Order</label>
              <input type="number" className="w-full border px-3 py-2 rounded" value={form.order} onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))} />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm text-gray-700 mb-1">Image</label>
              {form.image && (
                <img src={form.image} alt="preview" className="h-24 w-24 object-cover rounded mb-2" />
              )}
              <input type="file" accept="image/*" onChange={e => setForm(f => ({ ...f, file: e.target.files?.[0] || null }))} />
              {!form.file && !form.image && <p className="text-xs text-gray-500 mt-1">Choose an image to upload</p>}
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button disabled={loading} className="bg-black text-white px-4 py-2 rounded" type="submit">{loading ? 'Saving...' : 'Save'}</button>
            <button type="button" className="px-4 py-2 rounded border" onClick={() => { setIsFormOpen(false); setEditing(null); }}>Cancel</button>
          </div>
        </form>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {team.map(m => (
          <div key={(m as any)._id || m.name} className="border rounded p-3">
            <img src={m.image} alt={m.name} className="w-full h-40 object-cover rounded" />
            <div className="mt-2">
              <div className="font-semibold">{m.name}</div>
              <div className="text-sm text-gray-600">{m.role}</div>
            </div>
            <div className="flex gap-2 mt-3">
              <button className="px-3 py-1 rounded bg-gray-100" onClick={() => openForm(m as any)}>Edit</button>
              <button className="px-3 py-1 rounded bg-red-100 text-red-700" onClick={() => handleDelete(m)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


