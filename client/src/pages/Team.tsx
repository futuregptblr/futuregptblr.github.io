import { TeamMemberCard } from '../components/team/TeamMemberCard';
import { useEffect, useState } from 'react';
import type { TeamMember } from '../types';
import { apiGetTeam } from '../lib/api';

export function TeamPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await apiGetTeam();
        if (mounted) setMembers(data);
      } catch (e: any) {
        if (mounted) setError(e?.message || 'Failed to load team');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="pt-20">
      <section className="py-20 bg-gradient-to-r from-yellow-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Meet Our Team</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The passionate individuals driving FutureGPT's mission forward
            </p>
          </div>
          {loading && <p className="text-center text-gray-600">Loading...</p>}
          {error && <p className="text-center text-red-600">{error}</p>}
          {!loading && !error && (
            <div className="space-y-12">
              {[
                { title: 'Global Community & Bangalore Chapter', chapters: ['Global', 'Bangalore'] },
                { title: 'Pune Chapter', chapters: ['Pune'] },
                { title: 'Hyderabad Chapter', chapters: ['Hyderabad'] },
                { title: 'Chennai Chapter', chapters: ['Chennai'] },
              ].map((group) => {
                const groupMembers = members.filter((m) => group.chapters.includes((m.chapter || '').trim()));
                if (groupMembers.length === 0) return null;
                return (
                  <div key={group.title}>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">{group.title}</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {groupMembers.map((member) => (
                        <TeamMemberCard key={member.id || member.name} member={member} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}