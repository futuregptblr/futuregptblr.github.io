import React, { useState } from 'react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Users, 
  Star,
  Video,
  ExternalLink,
  Filter,
  Search,
  Bookmark,
  Share2,
  Award
} from 'lucide-react';

export function SpecialEvents() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'registered'>('upcoming');

  const upcomingEvents = [
    {
      id: 1,
      title: 'AI Innovation Summit 2025',
      description: 'Join industry leaders for a day of cutting-edge AI discussions, workshops, and networking opportunities.',
      date: 'November 15, 2025',
      time: '9:00 AM - 6:00 PM',
      location: 'Taj Palace, Mumbai',
      type: 'Conference',
      capacity: 200,
      registered: 156,
      price: '₹5,000',
      isPremium: true,
      image: '🎯',
      speakers: ['Dr. Sarah Chen', 'Rajesh Kumar', 'Priya Sharma'],
      tags: ['AI', 'Innovation', 'Networking']
    },
    {
      id: 2,
      title: 'Machine Learning Workshop',
      description: 'Hands-on workshop covering advanced ML techniques and real-world applications.',
      date: 'March 22, 2024',
      time: '2:00 PM - 8:00 PM',
      location: 'Tech Hub, Bangalore',
      type: 'Workshop',
      capacity: 50,
      registered: 42,
      price: '₹3,500',
      isPremium: true,
      image: '🤖',
      speakers: ['Alex Johnson', 'Dr. Maria Rodriguez'],
      tags: ['Machine Learning', 'Hands-on', 'Advanced']
    },
    {
      id: 3,
      title: 'Startup Pitch Night',
      description: 'Watch innovative AI startups pitch their ideas and connect with potential investors.',
      date: 'March 28, 2024',
      time: '7:00 PM - 10:00 PM',
      location: 'Innovation Center, Delhi',
      type: 'Networking',
      capacity: 100,
      registered: 78,
      price: '₹2,000',
      isPremium: false,
      image: '🚀',
      speakers: ['Various Startup Founders'],
      tags: ['Startups', 'Pitching', 'Investment']
    },
    {
      id: 4,
      title: 'Data Science Career Fair',
      description: 'Meet top companies hiring data scientists and explore career opportunities.',
      date: 'April 5, 2024',
      time: '10:00 AM - 4:00 PM',
      location: 'Convention Center, Hyderabad',
      type: 'Career Fair',
      capacity: 300,
      registered: 245,
      price: '₹1,500',
      isPremium: true,
      image: '📊',
      speakers: ['HR Representatives from Top Companies'],
      tags: ['Career', 'Recruitment', 'Networking']
    }
  ];

  const pastEvents = [
    {
      id: 5,
      title: 'Future of AI Panel Discussion',
      date: 'February 20, 2024',
      attendees: 180,
      rating: 4.8,
      image: '🎤'
    },
    {
      id: 6,
      title: 'Deep Learning Bootcamp',
      date: 'February 10, 2024',
      attendees: 45,
      rating: 4.9,
      image: '🧠'
    }
  ];

  const registeredEvents = upcomingEvents.filter(event => event.registered > 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-400 to-blue-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Special Events & Workshops</h1>
        <p className="text-white/90">Access exclusive events, workshops, and networking opportunities for premium members.</p>
      </div>

      {/* Featured Event */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <span className="bg-white/20 px-3 py-1 rounded-full text-sm font-medium">Featured Event</span>
              <h2 className="text-2xl font-bold mt-2">AI Innovation Summit 2025</h2>
              <p className="text-white/90 mt-2">The biggest AI event of the year with industry leaders and innovators</p>
            </div>
            <div className="text-right">
              <div className="text-3xl">🎯</div>
              <p className="text-sm opacity-90">November 15, 2025</p>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>Taj Palace, Mumbai</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>9:00 AM - 6:00 PM</span>
              </div>
              {/* <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>156/200 registered</span>
              </div> */}
            </div>
            {/* <button className="bg-yellow-400 text-blue-900 px-6 py-2 rounded-lg font-medium hover:bg-yellow-300 transition-colors">
              Register Now
            </button> */}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'upcoming', label: 'Upcoming Events', count: upcomingEvents.length },
              { id: 'registered', label: 'My Events', count: registeredEvents.length },
              { id: 'past', label: 'Past Events', count: pastEvents.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-yellow-400 text-yellow-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                <span className="ml-2 bg-gray-100 text-gray-900 py-0.5 px-2 rounded-full text-xs">
                  {tab.count}
                </span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'upcoming' && (
            <div className="space-y-6">
              {/* Search and Filters */}
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search events..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  />
                </div>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
                  <Filter className="h-4 w-4" />
                  <span>Filters</span>
                </button>
              </div>

              {/* Event Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="text-3xl">{event.image}</div>
                        <div className="flex items-center space-x-2">
                          {event.isPremium && (
                            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                              Premium
                            </span>
                          )}
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <Bookmark className="h-4 w-4 text-gray-500" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded">
                            <Share2 className="h-4 w-4 text-gray-500" />
                          </button>
                        </div>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                      <p className="text-gray-600 text-sm mb-4">{event.description}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{event.date}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{event.time}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="h-4 w-4" />
                          <span>{event.location}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-2">
                          {/* <span className="text-sm font-medium text-gray-900">{event.price}</span> */}
                          {/* <span className="text-sm text-gray-500">•</span> */}
                          <span className="text-sm text-gray-500">{event.type}</span>
                        </div>
                        {/* <div className="flex items-center space-x-1 text-sm text-gray-500">
                          <Users className="h-4 w-4" />
                          <span>{event.registered}/{event.capacity}</span>
                        </div> */}
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {event.tags.map((tag) => (
                          <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                          <span className="font-medium">Speakers:</span> {event.speakers.join(', ')}
                        </div>
                        <button disabled className="bg-gray-200 text-yellow-520 px-4 py-2 rounded-lg font-medium transition-colors">
                          Register
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'registered' && (
            <div className="space-y-4">
              {registeredEvents.map((event) => (
                <div key={event.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-2xl">{event.image}</div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                        <p className="text-sm text-gray-600">{event.date} • {event.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm text-green-600 font-medium">Registered</span>
                      <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'past' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pastEvents.map((event) => (
                <div key={event.id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl">{event.image}</div>
                    <div className="flex items-center space-x-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{event.rating}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{event.title}</h3>
                  <p className="text-sm text-gray-600 mb-4">{event.date}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{event.attendees} attendees</span>
                    <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                      View Recap
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 