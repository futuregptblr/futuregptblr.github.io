import { useEffect, useState } from 'react';
import { 
  Users, 
  MessageSquare, 
  Hash, 
  Search,
  Plus,
  Bookmark
} from 'lucide-react';
import { apiAddComment, apiCreateDiscussion, apiCreateGroup, apiListDiscussions, apiListGroups } from '../../lib/api';

export function CommunityHub() {
  const [activeTab, setActiveTab] = useState<'discussions' | 'groups'>('discussions');
  const [discussions, setDiscussions] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [membersCount, setMembersCount] = useState<number>(0);
  const [showNewDiscussion, setShowNewDiscussion] = useState(false);
  const [newDiscussion, setNewDiscussion] = useState({ title: '', content: '' });
  const [showNewGroup, setShowNewGroup] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: '', description: '' });
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    (async () => {
      try {
        const base = (await import('../../lib/utils')).API_BASE_URL;
        const [d, g, s] = await Promise.all([
          apiListDiscussions(),
          apiListGroups(),
          fetch(`${base}/api/community/stats`).then(r => r.json()),
        ]);
        setDiscussions(d || []);
        setGroups(g || []);
        setMembersCount(Math.max(0, s?.members || 0));
      } catch (e: any) {
        console.error(e);
      }
    })();
  }, []);

  async function handleCreateDiscussion() {
    try {
      const token = localStorage.getItem('token') || '';
      const created = await apiCreateDiscussion(token, {
        title: newDiscussion.title.trim(),
        content: newDiscussion.content.trim(),
      });
      setDiscussions((prev) => [created, ...prev]);
      setNewDiscussion({ title: '', content: '' });
      setShowNewDiscussion(false);
    } catch (e: any) {
      console.error(e);
    }
  }

  async function handleCreateGroup() {
    try {
      const token = localStorage.getItem('token') || '';
      const created = await apiCreateGroup(token, {
        name: newGroup.name.trim(),
        description: newGroup.description.trim(),
      });
      setGroups((prev) => [created, ...prev]);
      setNewGroup({ name: '', description: '' });
      setShowNewGroup(false);
    } catch (e: any) {
      console.error(e);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-400 to-blue-600 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">Community Hub</h1>
        <p className="text-white/90">Connect with fellow members, join discussions, and grow your professional network.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Members</p>
              <p className="text-2xl font-bold text-gray-900">{membersCount}</p>
            </div>
            <Users className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        {/* <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Groups</p>
              <p className="text-2xl font-bold text-gray-900">{groups.length}</p>
            </div>
            <Hash className="h-8 w-8 text-yellow-600" />
          </div>
        </div> */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Discussions</p>
              <p className="text-2xl font-bold text-gray-900">{discussions.length}</p>
            </div>
            <MessageSquare className="h-8 w-8 text-green-600" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'discussions', label: 'Discussions', count: discussions.length },
              // { id: 'groups', label: 'Groups', count: groups.length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'discussions' | 'groups')}
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
          {activeTab === 'discussions' && (
            <div className="space-y-6">
              {/* Search and New Post */}
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="text"
                    placeholder="Search discussions..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  />
                </div>
                <button onClick={() => setShowNewDiscussion((s) => !s)} className="px-4 py-2 bg-yellow-400 text-blue-900 rounded-lg font-medium hover:bg-yellow-300 transition-colors flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>New Post</span>
                </button>
              </div>

              {showNewDiscussion && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="grid gap-3">
                    <input
                      type="text"
                      value={newDiscussion.title}
                      onChange={(e) => setNewDiscussion((p) => ({ ...p, title: e.target.value }))}
                      placeholder="Title"
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                    <textarea
                      value={newDiscussion.content}
                      onChange={(e) => setNewDiscussion((p) => ({ ...p, content: e.target.value }))}
                      placeholder="What's on your mind?"
                      className="w-full px-3 py-2 border border-gray-300 rounded min-h-[100px]"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleCreateDiscussion}
                        disabled={!newDiscussion.title.trim() || !newDiscussion.content.trim()}
                        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                      >
                        Post
                      </button>
                      <button onClick={() => setShowNewDiscussion(false)} className="px-4 py-2 bg-gray-100 rounded">Cancel</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Discussion List */}
              <div className="space-y-4">
                {discussions.map((discussion: any) => (
                  <div key={discussion._id || discussion.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start space-x-4">
                      <div className="text-2xl">💬</div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{discussion.title}</h3>
                          {discussion.isPinned && (
                            <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full font-medium">
                              Pinned
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600 mb-3">{discussion.content}</p>
                        {Boolean(discussion.category) && (
                          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                            <span className="text-blue-600">{discussion.category}</span>
                          </div>
                        )}
                        <div className="flex flex-wrap gap-2 mb-4">
                          {(discussion.tags || []).map((tag: string) => (
                            <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                        <div className="mt-4">
                          <div className="space-y-2">
                            {(discussion.comments || []).map((c: any, idx: number) => (
                              <div key={idx} className="text-sm text-gray-700">
                                <span className="font-medium">{c.authorName || 'Member'}</span>
                                <span className="mx-1 text-gray-400">•</span>
                                <span>{c.content}</span>
                              </div>
                            ))}
                          </div>
                          <div className="flex gap-2 mt-3">
                            <input
                              type="text"
                              value={commentInputs[discussion._id || discussion.id] || ''}
                              onChange={(e) => setCommentInputs((p) => ({ ...p, [discussion._id || discussion.id]: e.target.value }))}
                              placeholder="Add a comment"
                              className="flex-1 px-3 py-2 border border-gray-300 rounded"
                            />
                            <button
                              onClick={async () => {
                                const text = (commentInputs[discussion._id || discussion.id] || '').trim();
                                if (!text) return;
                                try {
                                  const token = localStorage.getItem('token') || '';
                                  const updated = await apiAddComment(token, discussion._id || discussion.id, text);
                                  setDiscussions((prev) => prev.map((d: any) => (d._id === updated._id ? updated : d)));
                                  setCommentInputs((p) => ({ ...p, [discussion._id || discussion.id]: '' }));
                                } catch (e: any) {
                                  console.error(e);
                                }
                              }}
                              className="px-3 py-2 bg-blue-600 text-white rounded"
                            >
                              Post
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'groups' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Available Groups</h3>
                <button onClick={() => setShowNewGroup((s) => !s)} className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Create Group</span>
                </button>
              </div>

              {showNewGroup && (
                <div className="border border-gray-200 rounded-lg p-4">
                  <div className="grid gap-3 md:grid-cols-2">
                    <input
                      type="text"
                      value={newGroup.name}
                      onChange={(e) => setNewGroup((p) => ({ ...p, name: e.target.value }))}
                      placeholder="Group name"
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                    <input
                      type="text"
                      value={newGroup.description}
                      onChange={(e) => setNewGroup((p) => ({ ...p, description: e.target.value }))}
                      placeholder="Description (optional)"
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                  </div>
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={handleCreateGroup}
                      disabled={!newGroup.name.trim()}
                      className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                    >
                      Create
                    </button>
                    <button onClick={() => setShowNewGroup(false)} className="px-4 py-2 bg-gray-100 rounded">Cancel</button>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {groups.map((group: any) => (
                  <div key={group._id || group.id} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-3xl">#</div>
                      <div className="flex items-center space-x-2">
                        {group.isPrivate && (
                          <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">
                            Private
                          </span>
                        )}
                        <button className="p-1 hover:bg-gray-100 rounded">
                          <Bookmark className="h-4 w-4 text-gray-500" />
                        </button>
                      </div>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{group.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{group.description}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{group.members || 0} members</span>
                      </div>
                      <span className="text-sm text-gray-500">{group.category}</span>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {(group.tags || []).map((tag: string) => (
                        <span key={tag} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500">{group.recentActivity}</p>
                      <button className="bg-yellow-400 text-blue-900 px-4 py-2 rounded-lg font-medium hover:bg-yellow-300 transition-colors">
                        Join Group
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 