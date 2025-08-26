import React, { useState } from 'react';
import { Linkedin, Github, Globe } from 'lucide-react';
import { TeamMemberModal } from './TeamMemberModal';
import { TeamMember } from '../../types';

interface TeamMemberCardProps {
  member: TeamMember;
}

export function TeamMemberCard({ member }: TeamMemberCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div 
        className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="relative">
          <img 
            src={member.image} 
            alt={member.name}
            className="w-full h-64 object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <h3 className="text-xl font-semibold text-white">{member.name}</h3>
            <p className="text-yellow-300">{member.role}</p>
          </div>
        </div>
        <div className="p-4">
          <p className="text-gray-600 mb-4 line-clamp-2">{member.bio}</p>
          <div className="flex space-x-4">
            {member.linkedin && (
              <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
                <Linkedin className="h-5 w-5" />
              </a>
            )}
            {member.github && (
              <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:text-gray-900">
                <Github className="h-5 w-5" />
              </a>
            )}
            {member.website && (
              <a href={member.website} target="_blank" rel="noopener noreferrer" className="text-purple-600 hover:text-purple-700">
                <Globe className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>
      </div>

      <TeamMemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        member={member}
      />
    </>
  );
}