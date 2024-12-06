import React from 'react';
import { MapPin } from 'lucide-react';
import { Chapter } from '../../types';

interface ChapterCardProps {
  chapter: Chapter;
}

export function ChapterCard({ chapter }: ChapterCardProps) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <img 
        src={chapter.image} 
        alt={`${chapter.city} Chapter`}
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <div className="flex items-center mb-2">
          <MapPin className="h-5 w-5 text-purple-600 mr-2" />
          <h3 className="text-xl font-semibold text-gray-900">
            {chapter.city}, {chapter.country}
          </h3>
        </div>
        <p className="text-gray-600 mb-4">
          {chapter.memberCount.toLocaleString()} members
        </p>
        <div className="flex justify-between items-center">
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            Join Chapter
          </button>
          {chapter.leads.length > 0 && (
            <div className="flex -space-x-2">
              {chapter.leads.map((lead, index) => (
                <img
                  key={index}
                  src={lead.image}
                  alt={lead.name}
                  className="w-8 h-8 rounded-full border-2 border-white"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}