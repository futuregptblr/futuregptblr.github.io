import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { apiAdminLogin, apiCloudinarySign, apiCreateTeamMember, apiDeleteTeamMember, apiGetTeam, apiUpdateTeamMember, apiListEvents, apiCreateEvent, apiAdminListAllEvents, apiAdminListRegistrations, apiUpdateRegistrationStatus } from '../lib/api';
import type { TeamMember } from '../types';
import { Users, Calendar, LogOut, Plus, X, Edit2, Trash2, CheckCircle, XCircle, Clock } from 'lucide-react';

export default function AdminPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('adminToken'));
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [viewingRegistrations, setViewingRegistrations] = useState<string | null>(null);
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'events' | 'team'>('events');

  const [eventFormOpen, setEventFormOpen] = useState(false);
  const [eventForm, setEventForm] = useState<{
    title: string;
    description: string;
    date: string;
    startTime: string;
    endTime: string;
    location: string;
    chapter: string;
    type: string;
    capacity: number;
    file?: File | null;
  }>({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    chapter: '',
    type: 'Meetup',
    capacity: 0,
    file: null
  });
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
      try { setEvents(await apiAdminListAllEvents(token)); } catch { try { setEvents(await apiListEvents('all' as any)); } catch { } }
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
      toast.success('Welcome back!');
    } catch (e: any) {
      setError(e?.message || 'Login failed');
      toast.error(e?.message || 'Login failed');
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
        toast.success('Team member updated');
      } else {
        const created = await apiCreateTeamMember(token, payload);
        setTeam(t => [created, ...t]);
        toast.success('Team member added');
      }
      setIsFormOpen(false);
      setEditing(null);
    } catch (e: any) {
      setError(e?.message || 'Save failed');
      toast.error(e?.message || 'Save failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(member: TeamMember) {
    if (!token || !(member as any)._id) return;
    if (!window.confirm('Delete this member?')) return;
    try {
      await apiDeleteTeamMember(token, (member as any)._id);
      setTeam(t => t.filter(m => (m as any)._id !== (member as any)._id));
      toast.success('Team member deleted');
    } catch (e: any) {
      toast.error(e?.message || 'Delete failed');
    }
  }

  if (!token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mb-4">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Portal</h1>
              <p className="text-gray-600">Sign in to manage Futuregpt</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="admin@example.com"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <button
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {loading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
                <p className="text-xs text-gray-500">Manage your platform</p>
              </div>
            </div>
            <button
              onClick={() => { setToken(null); localStorage.removeItem('adminToken'); toast.info('Logged out'); }}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('events')}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${activeTab === 'events'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
          >
            <Calendar className="w-4 h-4" />
            Events
          </button>
          <button
            onClick={() => setActiveTab('team')}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${activeTab === 'team'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
          >
            <Users className="w-4 h-4" />
            Team
          </button>
        </div>

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Events Management</h2>
                <p className="text-gray-600 mt-1">Create and manage events, view registrations</p>
              </div>
              <button
                onClick={() => setEventFormOpen(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
              >
                <Plus className="w-4 h-4" />
                Add Event
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map(ev => (
                <div key={ev._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  {ev.image && (
                    <div className="h-40 bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden">
                      <img src={ev.image} alt={ev.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <h3 className="font-semibold text-gray-900 text-lg flex-1 min-w-0">{ev.title}</h3>
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full whitespace-nowrap flex-shrink-0">
                        {new Date(ev.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">{ev.location}</p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{ev.registrationsCount || 0} registered</span>
                      </div>
                      <button
                        onClick={async () => {
                          if (!token) return;
                          try {
                            const regs = await apiAdminListRegistrations(token, ev._id);
                            setRegistrations(regs);
                            setViewingRegistrations(ev._id);
                          } catch (err: any) { toast.error(err.message); }
                        }}
                        className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        Manage →
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {events.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>No events yet. Create your first event!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Team Tab */}
        {activeTab === 'team' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Team Management</h2>
                <p className="text-gray-600 mt-1">Manage team members and their profiles</p>
              </div>
              <button
                onClick={() => openForm(null)}
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
              >
                <Plus className="w-4 h-4" />
                Add Member
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {team.map(m => (
                <div key={(m as any)._id || m.name} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden">
                    <img src={m.image} alt={m.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1">{m.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{m.role}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openForm(m as any)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm font-medium"
                      >
                        <Edit2 className="w-3 h-3" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(m)}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors text-sm font-medium"
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {team.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>No team members yet. Add your first member!</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Registration Modal */}
      {viewingRegistrations && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Event Registrations</h2>
              <button
                onClick={() => { setViewingRegistrations(null); setRegistrations([]); }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="overflow-y-auto flex-1 p-6">
              {registrations.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p>No registrations found</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {registrations.map(reg => (
                    <div key={reg._id} className="bg-gray-50 rounded-lg p-4 flex items-center justify-between hover:bg-gray-100 transition-colors">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">{reg.userName || reg.userId?.name || 'Unknown'}</div>
                        <div className="text-sm text-gray-600">{reg.userEmail || reg.userId?.email || '—'}</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${reg.status === 'approved' || reg.status === 'registered'
                          ? 'bg-green-100 text-green-800'
                          : reg.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                          }`}>
                          {reg.status === 'approved' || reg.status === 'registered' ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : reg.status === 'rejected' ? (
                            <XCircle className="w-3 h-3" />
                          ) : (
                            <Clock className="w-3 h-3" />
                          )}
                          {reg.status}
                        </span>
                        {reg.status === 'pending' && (
                          <div className="flex gap-2">
                            <button
                              onClick={async () => {
                                try {
                                  await apiUpdateRegistrationStatus(token, reg._id, 'approved');
                                  setRegistrations(rr => rr.map(r => r._id === reg._id ? { ...r, status: 'approved' } : r));
                                  toast.success('Approved');
                                } catch (err: any) { toast.error(err.message); }
                              }}
                              className="p-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={async () => {
                                try {
                                  await apiUpdateRegistrationStatus(token, reg._id, 'rejected');
                                  setRegistrations(rr => rr.map(r => r._id === reg._id ? { ...r, status: 'rejected' } : r));
                                  toast.success('Rejected');
                                } catch (err: any) { toast.error(err.message); }
                              }}
                              className="p-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                        {(reg.status === 'approved' || reg.status === 'registered' || reg.status === 'rejected') && (
                          <button
                            onClick={async () => {
                              const newStatus = reg.status === 'rejected' ? 'approved' : 'rejected';
                              if (!window.confirm(`Change status to ${newStatus}?`)) return;
                              try {
                                await apiUpdateRegistrationStatus(token, reg._id, newStatus);
                                setRegistrations(rr => rr.map(r => r._id === reg._id ? { ...r, status: newStatus } : r));
                                toast.success(`Status updated to ${newStatus}`);
                              } catch (err: any) { toast.error(err.message); }
                            }}
                            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                          >
                            Change
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Event Form Modal */}
      {eventFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Create Event</h2>
              <button
                onClick={() => setEventFormOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!token) return;
              setLoading(true);
              let imageUrl = '';
              try {
                if (eventForm.file) {
                  const sign = await apiCloudinarySign(token, { folder: 'futuregpt/events' });
                  const fd = new FormData();
                  fd.append('file', eventForm.file);
                  fd.append('api_key', sign.apiKey);
                  fd.append('timestamp', String(sign.timestamp));
                  fd.append('folder', sign.folder);
                  fd.append('signature', sign.signature);
                  const res = await fetch(`https://api.cloudinary.com/v1_1/${sign.cloudName}/image/upload`, { method: 'POST', body: fd });
                  if (!res.ok) throw new Error('Upload failed');
                  const json = await res.json();
                  imageUrl = json.secure_url as string;
                }
              } catch (uploadErr: any) {
                console.error(uploadErr);
                toast.error('Image upload failed');
              }

              const payload: any = {
                title: eventForm.title,
                description: eventForm.description || undefined,
                date: eventForm.date ? new Date(eventForm.date).toISOString() : undefined,
                startTime: eventForm.startTime || undefined,
                endTime: eventForm.endTime || undefined,
                location: eventForm.location,
                chapter: eventForm.chapter || undefined,
                type: eventForm.type || undefined,
                capacity: Number(eventForm.capacity) || 0,
                isPremium: true,
                image: imageUrl || undefined,
              };
              try {
                await apiCreateEvent(token, payload);
                toast.success('Event created');
              } catch (err: any) {
                toast.error(err.message || 'Failed to create event');
                setLoading(false);
                return;
              }
              try {
                const [up, past] = await Promise.all([apiListEvents('upcoming'), apiListEvents('past')]);
                const byId: Record<string, any> = {};
                [...up, ...past].forEach(e => { byId[e._id] = e; });
                setEvents(Object.values(byId));
              } catch {
                setEvents(await apiListEvents('all' as any));
              }
              setEventFormOpen(false);
              setEventForm({ title: '', description: '', date: '', startTime: '', endTime: '', location: '', chapter: '', type: 'Meetup', capacity: 0, file: null });
              setLoading(false);
            }} className="overflow-y-auto flex-1 p-6">
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
                    <input
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={eventForm.title}
                      onChange={e => setEventForm(f => ({ ...f, title: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={eventForm.date}
                      onChange={e => setEventForm(f => ({ ...f, date: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Time</label>
                    <input
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="09:00"
                      value={eventForm.startTime}
                      onChange={e => setEventForm(f => ({ ...f, startTime: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                    <input
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="18:00"
                      value={eventForm.endTime}
                      onChange={e => setEventForm(f => ({ ...f, endTime: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                    <input
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={eventForm.location}
                      onChange={e => setEventForm(f => ({ ...f, location: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Chapter</label>
                    <input
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={eventForm.chapter}
                      onChange={e => setEventForm(f => ({ ...f, chapter: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Capacity</label>
                    <input
                      type="number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={eventForm.capacity}
                      onChange={e => setEventForm(f => ({ ...f, capacity: Number(e.target.value) }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => setEventForm(f => ({ ...f, file: e.target.files?.[0] || null }))}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    value={eventForm.description}
                    onChange={e => setEventForm(f => ({ ...f, description: e.target.value }))}
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50"
                >
                  {loading ? 'Creating...' : 'Create Event'}
                </button>
                <button
                  type="button"
                  onClick={() => setEventFormOpen(false)}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Team Member Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">{editing ? 'Edit Member' : 'Add Member'}</h2>
              <button
                onClick={() => { setIsFormOpen(false); setEditing(null); }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={submitForm} className="overflow-y-auto flex-1 p-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
                  {error}
                </div>
              )}
              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                    <input
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                    <input
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={form.role}
                      onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Designation</label>
                    <input
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={form.designation}
                      onChange={e => setForm(f => ({ ...f, designation: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Chapter</label>
                    <select
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">LinkedIn</label>
                    <input
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={form.linkedin}
                      onChange={e => setForm(f => ({ ...f, linkedin: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">GitHub</label>
                    <input
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={form.github}
                      onChange={e => setForm(f => ({ ...f, github: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                    <input
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={form.website}
                      onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Order</label>
                    <input
                      type="number"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={form.order}
                      onChange={e => setForm(f => ({ ...f, order: Number(e.target.value) }))}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bio</label>
                  <textarea
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    value={form.bio}
                    onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Image</label>
                  {form.image && (
                    <img src={form.image} alt="preview" className="h-24 w-24 object-cover rounded-lg mb-2" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => setForm(f => ({ ...f, file: e.target.files?.[0] || null }))}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => { setIsFormOpen(false); setEditing(null); }}
                  className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
