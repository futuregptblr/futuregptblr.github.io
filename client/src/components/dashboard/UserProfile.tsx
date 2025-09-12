import { useState, useEffect } from "react";
import {
  User,
  Settings,
  Bell,
  Shield,
  CreditCard,
  Download,
  BookOpen,
  Award,
  Calendar,
  MapPin,
  Mail,
  Phone,
  Edit,
  Camera,
  Globe,
  Moon,
  Sun,
} from "lucide-react";
import { EditProfileModal } from "./EditProfileModal";
import PremiumMembershipCard from "../premium/PremiumMembershipCard";
import { User as UserType, Experience } from "../../types";
import { API_BASE_URL } from "../../lib/utils";
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../lib/store';
import { setUser } from '../../slices/userSlice';

export function UserProfile() {
  const [activeTab, setActiveTab] = useState<
    "profile" | "settings" | "subscription" | "achievements"
  >("profile");
  const [showEditModal, setShowEditModal] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((s: RootState) => s.user.currentUser as UserType | null);
  const [loading, setLoading] = useState(true);

  // Removed hardcoded placeholder; component will render from API user only

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const userData = await response.json();
          dispatch(setUser(userData));
        }
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (updatedUser: Partial<UserType>) => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const response = await fetch(`${API_BASE_URL}/api/user/profile`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedUser),
        });
        if (response.ok) {
          const updatedUserData = await response.json();
          dispatch(setUser(updatedUserData));
        }
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  const achievements = [
    {
      id: 1,
      title: "Course Completion",
      description: 'Completed "Advanced Machine Learning" course',
      icon: "🎓",
      date: "2 weeks ago",
      points: 100,
    },
    {
      id: 2,
      title: "Event Participation",
      description: "Attended AI Innovation Summit 2024",
      icon: "🎯",
      date: "1 month ago",
      points: 50,
    },
    {
      id: 3,
      title: "Community Contribution",
      description: "Helped 10+ members with technical questions",
      icon: "🤝",
      date: "2 months ago",
      points: 75,
    },
    {
      id: 4,
      title: "Skill Assessment",
      description: 'Achieved "Expert" level in Python',
      icon: "🏆",
      date: "3 months ago",
      points: 200,
    },
  ];

  // removed unused static subscription placeholder

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-yellow-400 to-blue-600 rounded-xl p-6 text-white">
          <h1 className="text-2xl font-bold mb-2">Profile & Settings</h1>
          <p className="text-white/90">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-400 to-blue-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Profile & Settings</h1>
        <p className="text-white/90">
          Manage your account, preferences, and subscription details.
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: "profile", label: "Profile", icon: User },
              { id: "settings", label: "Settings", icon: Settings },
              { id: "subscription", label: "Subscription", icon: CreditCard },
              { id: "achievements", label: "Achievements", icon: Award },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? "border-yellow-400 text-yellow-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "profile" && user && (
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex items-start space-x-6">
                <div className="relative">
                  {/* <div className="text-6xl">{user?.avatar || '👤'}</div>
                  <button className="absolute bottom-0 right-0 h-8 w-8 bg-yellow-400 rounded-full flex items-center justify-center hover:bg-yellow-300 transition-colors">
                    <Camera className="h-4 w-4 text-blue-900" />
                  </button> */}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {user?.name || ''}
                      </h2>
                      <p className="text-gray-600">
                        {(user?.role || '')} {user?.company ? `at ${user.company}` : ''}
                      </p>
                    </div>
                    <button
                      onClick={() => setShowEditModal(true)}
                      className="px-4 py-2 bg-yellow-400 text-blue-900 rounded-lg font-medium hover:bg-yellow-300 transition-colors flex items-center space-x-2"
                    >
                      <Edit className="h-4 w-4" />
                      <span>Edit Profile</span>
                    </button>
                  </div>
                  <p className="text-gray-600 mb-4">{user?.bio || ''}</p>
                  {user?.resumeUrl && (
                    <div className="mb-4">
                      <a
                        href={user.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-700 text-sm flex items-center space-x-1"
                      >
                        <Download className="h-4 w-4" />
                        <span>View Resume</span>
                      </a>
                    </div>
                  )}
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{user?.location || ''}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{user?.createdAt ? `Joined ${new Date(user.createdAt).toLocaleDateString()}` : ''}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">{user?.email}</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700">{(user as any)?.phone || ''}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Professional Info
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Current Role
                      </label>
                      <p className="text-gray-900">{user?.role || ''}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Company
                      </label>
                      <p className="text-gray-900">{user?.company || ''}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Skills */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {(user?.skills || []).map((skill: string) => (
                    <span
                      key={skill}
                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Interests */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Interests
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(user?.interests || []).map((interest: string) => (
                    <span
                      key={interest}
                      className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              {/* Experience */}
              {user?.experience && user.experience.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Experience</h3>
                  <div className="space-y-4">
                    {user.experience.map((exp: Experience, idx: number) => (
                      <div key={idx} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-gray-900">{exp.title} {exp.company ? `at ${exp.company}` : ''}</p>
                            <p className="text-sm text-gray-600">
                              {(exp.startDate ? new Date(exp.startDate).toLocaleDateString() : '')}
                              {" - "}
                              {(exp.endDate ? new Date(exp.endDate).toLocaleDateString() : 'Present')}
                            </p>
                          </div>
                        </div>
                        {exp.description && (
                          <p className="mt-2 text-gray-700 text-sm">{exp.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Notifications */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                    <Bell className="h-5 w-5" />
                    <span>Notifications</span>
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Email notifications</span>
                      <input
                        type="checkbox"
                        className="rounded"
                        defaultChecked
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Push notifications</span>
                      <input
                        type="checkbox"
                        className="rounded"
                        defaultChecked
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Event reminders</span>
                      <input
                        type="checkbox"
                        className="rounded"
                        defaultChecked
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Job alerts</span>
                      <input type="checkbox" className="rounded" />
                    </div>
                  </div>
                </div>

                {/* Privacy */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Privacy</span>
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Profile visibility</span>
                      <select className="border border-gray-300 rounded px-3 py-1 text-sm">
                        <option>Public</option>
                        <option>Members only</option>
                        <option>Private</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">Show online status</span>
                      <input
                        type="checkbox"
                        className="rounded"
                        defaultChecked
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-700">
                        Allow direct messages
                      </span>
                      <input
                        type="checkbox"
                        className="rounded"
                        defaultChecked
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Theme */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                  <Globe className="h-5 w-5" />
                  <span>Appearance</span>
                </h3>
                <div className="flex items-center space-x-4">
                  <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                    <Sun className="h-4 w-4" />
                    <span>Light</span>
                  </button>
                  <button className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg">
                    <Moon className="h-4 w-4" />
                    <span>Dark</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === "subscription" && (
            <div className="space-y-6">
              {user?.isPremium ? (
                <div className="max-w-2xl">
                  <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-200 rounded-xl p-6 shadow-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-yellow-800 font-bold">Premium Status</div>
                      <span className="text-xs text-yellow-700">Lifetime</span>
                    </div>
                    <p className="text-yellow-700 mb-1">You're a premium member.</p>
                    {user.premiumPurchaseDate && (
                      <p className="text-sm text-yellow-600">Member since: {new Date(user.premiumPurchaseDate).toLocaleDateString()}</p>
                    )}
                  </div>
                </div>
              ) : (
                <div className="max-w-2xl">
                  <PremiumMembershipCard user={user as any} onPurchaseSuccess={() => { /* handled via redirect */ }} />
                </div>
              )}
            </div>
          )}

          {activeTab === "achievements" && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Points</p>
                      <p className="text-2xl font-bold text-gray-900">425</p>
                    </div>
                    <Award className="h-8 w-8 text-yellow-600" />
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Achievements</p>
                      <p className="text-2xl font-bold text-gray-900">12</p>
                    </div>
                    <BookOpen className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Events Attended</p>
                      <p className="text-2xl font-bold text-gray-900">8</p>
                    </div>
                    <Calendar className="h-8 w-8 text-green-600" />
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Rank</p>
                      <p className="text-2xl font-bold text-gray-900">#156</p>
                    </div>
                    <User className="h-8 w-8 text-purple-600" />
                  </div>
                </div>
              </div>

              {/* Achievements List */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Recent Achievements
                </h3>
                <div className="space-y-4">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-3xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">
                            {achievement.title}
                          </h4>
                          <p className="text-gray-600 text-sm">
                            {achievement.description}
                          </p>
                          <p className="text-gray-500 text-xs mt-1">
                            {achievement.date}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm font-medium">
                            +{achievement.points} pts
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {showEditModal && user && (
        <EditProfileModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          user={user}
          onSave={handleSaveProfile}
        />
      )}
    </div>
  );
}
