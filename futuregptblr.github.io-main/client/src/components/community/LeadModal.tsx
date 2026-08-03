import React from 'react';
import Modal from 'react-modal';
import { X, Linkedin } from 'lucide-react';
import { ChapterLead } from '../../types';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: ChapterLead;
}

Modal.setAppElement('#root');

export function LeadModal({ isOpen, onClose, lead }: LeadModalProps) {
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
          src={lead.image}
          alt={lead.name}
          className="w-32 h-32 rounded-full object-cover"
        />
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{lead.name}</h2>
          <p className="text-purple-600 font-medium mb-2">{lead.role}</p>
          <p className="text-gray-600 mb-4">{lead.chapter} Chapter</p>
          <p className="text-gray-700 mb-6">{lead.bio}</p>
          
          <a
            href={lead.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Linkedin className="h-5 w-5 mr-2" />
            Connect on LinkedIn
          </a>
        </div>
      </div>
    </Modal>
  );
}