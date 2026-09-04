import { useState, useEffect } from 'react';
import { Header } from '../components/Header';
import { VoiceAssistant } from '../components/VoiceAssistant';
import { Users, MessageSquare, ThumbsUp, Share2, Send, Loader2 } from 'lucide-react';
import { BackButton } from '../components/BackButton';
import { communityApi, CommunityPost } from '../../utils/api';
import { useAuth } from '../components/AuthProvider';
import { toast } from 'sonner';
export function Community() {
  const { user } = useAuth();
  const [newPost, setNewPost] = useState('');
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const response = await communityApi.getPosts();
      setPosts(response.posts || []);
    } catch (error) {
      console.error('Failed to load posts:', error);
      toast.error('Failed to load community posts');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.trim() || !user) {
      if (!user) toast.error('Please log in to post');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const response = await communityApi.createPost({
        content: newPost,
        location: user.location || 'Unknown Location',
        author_name: user.name || 'Anonymous Farmer'
      });
      setPosts([response.post, ...posts]);
      setNewPost('');
      toast.success('Post created successfully!');
    } catch (error) {
      console.error('Failed to create post:', error);
      toast.error('Failed to create post');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nearbyFarmers = [
    { name: 'Ramesh Yadav', distance: '2 km', crop: 'Wheat' },
    { name: 'Vikram Joshi', distance: '5 km', crop: 'Rice' },
    { name: 'Anil Sharma', distance: '8 km', crop: 'Cotton' },
    { name: 'Prakash Verma', distance: '12 km', crop: 'Sugarcane' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <VoiceAssistant />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <BackButton className="mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Farmer Community
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Connect, share, and learn from fellow farmers
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Create Post */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
              <div className="flex gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                  F
                </div>
                <div className="flex-1">
                  <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="Share your farming experience, ask questions..."
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                    rows={3}
                  />
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <svg
                          className="w-5 h-5 text-gray-600 dark:text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </button>
                    </div>
                    <button
                      onClick={handleCreatePost}
                      disabled={!newPost.trim() || isSubmitting}
                      className="px-6 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 transition-all flex items-center gap-2"
                    >
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Posts */}
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin text-green-500" />
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No posts yet. Be the first to share!
              </div>
            ) : (
              posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
                >
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
                      {post.author_name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{post.author_name}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {post.location} • {new Date(post.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 mb-4">{post.content}</p>

                  {post.image_url && (
                    <div className="mb-4 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden">
                      <img src={post.image_url} alt="Post attachment" className="w-full h-auto max-h-96 object-cover" />
                    </div>
                  )}

                  <div className="flex items-center gap-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                      <ThumbsUp className="w-5 h-5" />
                      <span>{post.likes_count || 0}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                      <MessageSquare className="w-5 h-5" />
                      <span>{post.comments_count || 0}</span>
                    </button>
                    <button className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                      <Share2 className="w-5 h-5" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Nearby Farmers */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-green-600 dark:text-green-400" />
                <h3 className="font-semibold text-gray-900 dark:text-white">Nearby Farmers</h3>
              </div>
              <div className="space-y-3">
                {nearbyFarmers.map((farmer, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                        {farmer.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white text-sm">
                          {farmer.name}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {farmer.distance} • {farmer.crop}
                        </p>
                      </div>
                    </div>
                    <button className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg text-sm hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors">
                      Connect
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Topics */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Popular Topics</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  'Wheat Farming',
                  'Organic Methods',
                  'Pest Control',
                  'Irrigation',
                  'Market Prices',
                  'Government Schemes',
                ].map((topic) => (
                  <button
                    key={topic}
                    className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
                  >
                    #{topic.replace(' ', '')}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}