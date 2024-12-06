import React from 'react';
import { ChapterCard } from '../components/chapters/ChapterCard';
import { chapters } from '../data/chapters';

export function ChaptersPage() {
  return (
    <div className="pt-20">
      <section className="py-20 bg-gradient-to-r from-yellow-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Global Chapters</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join a FutureGPT chapter near you and connect with local AI enthusiasts
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {chapters.map((chapter) => (
              <ChapterCard key={chapter.id} chapter={chapter} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}