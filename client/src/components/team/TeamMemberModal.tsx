import React from 'react';
import Modal from 'react-modal';
import { X, Linkedin, Github, Globe, MapPin, Mail } from 'lucide-react';
import { TeamMember } from '../../types';

interface TeamMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: TeamMember;
}

export function TeamMemberModal({ isOpen, onClose, member }: TeamMemberModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="max-w-2xl mx-auto mt-20 bg-white rounded-xl p-6 relative"
      overlayClassName="fixed inset-0 bg-black/50 flex items-start justify-center"
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
      >
        <X className="h-6 w-6" />
      </button>
      
      <div className="flex flex-col md:flex-row gap-6">
        <img
          src={member.image}
          alt={member.name}
          className="w-32 h-32 rounded-full object-cover"
        />
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{member.name}</h2>
          <p className="text-purple-600 font-medium mb-2">{member.role}</p>
          {member.chapter && (
            <p className="flex items-center text-gray-600 mb-4">
              <MapPin className="h-4 w-4 mr-2" />
              {member.chapter} Chapter
            </p>
          )}
          <p className="text-gray-700 mb-6">{member.bio}</p>
          
          <div className="flex space-x-4">
            {member.linkedin && (
              <a
                href={member.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Linkedin className="h-5 w-5 mr-2" />
                LinkedIn
              </a>
            )}
            {member.github && (
              <a
                href={member.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors"
              >
                <Github className="h-5 w-5 mr-2" />
                GitHub
              </a>
            )}
            {member.website && (
              <a
                href={member.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <Globe className="h-5 w-5 mr-2" />
                Website
              </a>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}