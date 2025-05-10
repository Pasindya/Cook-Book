import React, { useState, useEffect } from 'react';
import { 
  FaHeart, FaRegHeart, FaShareAlt, FaClock, 
  FaUtensils, FaEllipsisH, FaRegBookmark, 
  FaBookmark, FaFireAlt, FaLeaf, FaBreadSlice,
  FaEdit, FaTrash, FaComment, FaUser,
  FaStar, FaRegStar, FaThumbsUp, FaRegThumbsUp,
  FaCamera, FaMapMarkerAlt, FaUserFriends, FaBookOpen
} from 'react-icons/fa';
import { GiMeal, GiFruitBowl, GiChickenOven } from 'react-icons/gi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/Navbar';
import axios from 'axios';

const SocialFeed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    type: [],
    time: null,
    difficulty: null
  });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      // In a real app, this would fetch from your backend
      const dummyPosts = [
        {
          id: 1,
          user: 'Chef John',
          avatar: 'https://via.placeholder.com/50',
          content: 'Just made an amazing pasta dish! Check out my new recipe.',
          image: 'https://via.placeholder.com/500x300',
          likes: 42,
          comments: 12,
          timestamp: '2 hours ago',
          type: 'Italian',
          time: 45,
          difficulty: 'Medium'
        },
        {
          id: 2,
          user: 'Master Chef',
          avatar: 'https://via.placeholder.com/50',
          content: 'My secret ingredient for the perfect steak? Patience and love!',
          image: 'https://via.placeholder.com/500x300',
          likes: 89,
          comments: 24,
          timestamp: '4 hours ago',
          type: 'Meat',
          time: 30,
          difficulty: 'Hard'
        }
      ];
      setPosts(dummyPosts);
    } catch (error) {
      console.error("Error loading posts:", error);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const handlePostSubmit = (e) => {
    e.preventDefault();
    if (newPost.trim()) {
      const post = {
        id: posts.length + 1,
        user: 'You',
        avatar: 'https://via.placeholder.com/50',
        content: newPost,
        image: selectedImage || 'https://via.placeholder.com/500x300',
        likes: 0,
        comments: 0,
        timestamp: 'Just now',
        type: 'General',
        time: 0,
        difficulty: 'Easy'
      };
      setPosts([post, ...posts]);
      setNewPost('');
      setSelectedImage(null);
      toast.success('Post created successfully!');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getTypeIcon = (type) => {
    switch(type?.toLowerCase()) {
      case 'vegetarian': return <FaLeaf style={{ color: '#4CAF50' }} />;
      case 'vegan': return <GiFruitBowl style={{ color: '#8BC34A' }} />;
      case 'meat': return <GiChickenOven style={{ color: '#F44336' }} />;
      case 'dessert': return <FaBreadSlice style={{ color: '#FF9800' }} />;
      case 'spicy': return <FaFireAlt style={{ color: '#FF5722' }} />;
      default: return <GiMeal style={{ color: '#607D8B' }} />;
    }
  };

  const filteredPosts = posts.filter(post => {
    if (searchQuery) {
      return post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
             post.user.toLowerCase().includes(searchQuery.toLowerCase());
    }
    if (selectedFilters.type.length > 0 && !selectedFilters.type.includes(post.type)) {
      return false;
    }
    if (selectedFilters.time && post.time > selectedFilters.time) {
      return false;
    }
    if (selectedFilters.difficulty && post.difficulty !== selectedFilters.difficulty) {
      return false;
    }
    return true;
  });

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="bg-rose-50 min-h-screen">
      <Navbar />
      <ToastContainer />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-rose-300 to-orange-300 text-gray-800 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Cooking Community</h1>
            <p className="text-xl mb-8">Share your culinary journey with fellow food lovers</p>
            <div className="max-w-2xl mx-auto">
              <div className="flex items-center bg-white rounded-full p-2 shadow-lg">
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-6 py-3 text-gray-800 focus:outline-none"
                />
                <button className="bg-rose-300 text-gray-800 px-6 py-3 rounded-full hover:bg-rose-400 transition-colors">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Create Post Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <form onSubmit={handlePostSubmit} className="space-y-4">
            <textarea
              placeholder="Share your cooking journey..."
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              className="w-full p-4 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-300"
              rows="4"
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <FaCamera className="text-2xl text-gray-600 hover:text-rose-500" />
                </label>
                {selectedImage && (
                  <img
                    src={selectedImage}
                    alt="Preview"
                    className="h-12 w-12 object-cover rounded"
                  />
                )}
              </div>
              <button
                type="submit"
                className="bg-rose-500 text-white px-6 py-2 rounded-full hover:bg-rose-600 transition-colors"
              >
                Share
              </button>
            </div>
          </form>
        </div>

        {/* Posts Feed */}
        <div className="space-y-6">
          {filteredPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center mb-4">
                  <img
                    src={post.avatar}
                    alt={post.user}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h3 className="font-semibold text-lg">{post.user}</h3>
                    <p className="text-gray-500 text-sm">{post.timestamp}</p>
                  </div>
                  <div className="ml-auto flex items-center space-x-2">
                    {getTypeIcon(post.type)}
                    <span className="text-sm text-gray-500">{post.type}</span>
                  </div>
                </div>
                <p className="text-gray-800 mb-4">{post.content}</p>
                <img
                  src={post.image}
                  alt="Post"
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
                <div className="flex items-center justify-between border-t pt-4">
                  <div className="flex items-center space-x-6">
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-rose-500">
                      <FaHeart />
                      <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-rose-500">
                      <FaComment />
                      <span>{post.comments}</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-rose-500">
                      <FaShareAlt />
                    </button>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="flex items-center text-gray-600">
                      <FaClock className="mr-1" />
                      {post.time} min
                    </span>
                    <span className="text-gray-600">{post.difficulty}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialFeed; 