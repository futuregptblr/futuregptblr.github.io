import React from 'react';

const members = [
  {
    name: 'Sarang Kamalakar',
    role: 'Founder & CEO - PARENTHESES SYSTEMS',
    image: '/community/sarang.jpeg',
  },
  {
    name: 'Arun Badole',
    role: 'VP Engineering - Mindbrowser',
    image: '/community/arun.jpeg',
  },
  {
    name: 'Yogesh Kulkarn',
    role: 'Co-Founder & Director Altizon Inc',
    image: '/community/yogesh.jpeg',
  },
  {
    name: 'Arun Mane',
    role: 'Founder & CEO at AmynaSec Research Lab',
    image: '/community/arun.jpeg',
  },
  {
    name: 'Navin Kabra',
    role: 'Co-founder & CTO at Reliscore.com',
    image: '/community/navin.jpeg',
  },
  
  {
    name: 'Gurmeet Singh',
    role: 'Founder of Blazeclan Technologies',
    image: '/community/gurmeet.jpeg',
  },
  
  {
    name: 'Vinay Kumar Sankarapu',
    role: 'Founder and CEO of Arya.ai',
    image: '/community/vinay.jpeg',
  },
  
  {
    name: 'Rajat Gahlot',
    role: 'Co-Founder QuillAudits',
    image: '/community/rajat.jpeg',
  },
  

  
];

export function PastSpeakers() {
  return (
    <section id="pastspeakers" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Past Speakers
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join thousands of AI enthusiasts and professionals who are shaping the future
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {members.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <img
                src={member.image}
                alt={member.name}
                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
              />
              <h3 className="text-lg font-semibold text-gray-900">{member.name}</h3>
              <p className="text-gray-600">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}