import React from 'react';

const members = [
  {
    name: 'Aarushi Goyal',
    role: 'Senior Software Engineer',
    image: '/community/aaru.jpeg',
  },
  {
    name: 'Sanjeev Jaiswal',
    role: 'Security Architect',
    image: '/community/sanjeev.jpeg',
  },
  {
    name: 'Sivakumar (Shiva) Dhakshinamoorthy',
    role: 'GenAI Leader',
    image: '/community/siva.jpeg',
  },
  {
    name: 'Vellanki Sriharsha',
    role: 'Applied AI Leader',
    image: '/community/vel.jpeg',
  },
  {
    name: 'Harsh Sanghvi',
    role: 'Red Team Lead',
    image: '/community/harsh.jpeg',
  },
  
  {
    name: 'Prabhanjan Gururaj',
    role: 'Director - Solution Engineering',
    image: '/community/prab.jpeg',
  },
];

export function Community() {
  return (
    <section id="community" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Meet Our Community
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