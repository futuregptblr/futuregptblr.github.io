import React from 'react';
import { TeamMemberCard } from '../components/team/TeamMemberCard';
import { teamMembers, puneChapter, hyderabadChapter, chennaiChapter } from '../data/team';

export function TeamPage() {
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

          <h1 className="text-2xl font-bold text-gray-900 mb-4">Global Community & Bangalore Chapter</h1>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Pune Chapter</h1>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {puneChapter.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Hyderabad Chapter</h1>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {hyderabadChapter.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Chennai Chapter</h1>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {chennaiChapter.map((member) => (
              <TeamMemberCard key={member.id} member={member} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}