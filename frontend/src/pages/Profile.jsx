import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { 
  FaUserCircle, 
  FaBookmark, 
  FaHeart, 
  FaEdit, 
  FaCamera,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUtensils,
  FaClock,
  FaShareAlt,
  FaComment
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Profile() {
  const [activeTab, setActiveTab] = useState('saved'); // 'saved', 'liked', or 'joinedChallenges'
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [likedRecipes, setLikedRecipes] = useState([]);
  const [joinedChallenges, setJoinedChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    location: 'New York, USA',
    joinDate: 'January 2024',
    bio: 'Passionate home chef and food enthusiast. Love experimenting with new recipes and sharing them with the community!',
    profileImage: null,
    coverImage: null
  });
  const navigate = useNavigate();
  const location = useLocation();
  const [joinMessage, setJoinMessage] = useState('');

  useEffect(() => {
    // If redirected from join, set tab and show message
    if (location.state && location.state.activeTab === 'joinedChallenges') {
      setActiveTab('joinedChallenges');
      if (location.state.message) {
        setJoinMessage(location.state.message);
        setTimeout(() => setJoinMessage(''), 5000);
      }
    }
    loadUserData();
    loadJoinedChallenges();
    // eslint-disable-next-line
  }, []);

  const loadUserData = async () => {
    try {
      setLoading(true);
      // Load saved recipes
      const savedIds = JSON.parse(localStorage.getItem('savedRecipes')) || [];
      const savedRecipesData = await Promise.all(
        savedIds.map(id => 
          axios.get(`http://localhost:8080/api/recipes/${id}`)
            .then(res => res.data)
            .catch(() => null)
        )
      );
      setSavedRecipes(savedRecipesData.filter(recipe => recipe !== null));

      // Load liked recipes
      const likedIds = JSON.parse(localStorage.getItem('likedRecipes')) || [];
      const likedRecipesData = await Promise.all(
        likedIds.map(id => 
          axios.get(`http://localhost:8080/api/recipes/${id}`)
            .then(res => res.data)
            .catch(() => null)
        )
      );
      setLikedRecipes(likedRecipesData.filter(recipe => recipe !== null));
    } catch (error) {
      console.error('Error loading user data:', error);
      toast.error('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  const loadJoinedChallenges = () => {
    const joined = JSON.parse(localStorage.getItem('joinedChallenges')) || [];
    setJoinedChallenges(joined);
  };

  const handleImageUpload = (type) => {
    // Implement image upload functionality
    toast.info('Image upload functionality coming soon!');
  };

  const getImageUrl = (recipeImage) => {
    if (!recipeImage) return 'https://via.placeholder.com/400x250?text=Recipe+Image';
    return `http://localhost:8080/api/recipes/images/${recipeImage}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      {joinMessage && (
        <div className="max-w-4xl mx-auto mt-4 mb-0 px-4">
          <div className="bg-green-100 text-green-800 px-4 py-3 rounded-lg shadow text-center font-semibold">
            {joinMessage}
          </div>
        </div>
      )}
      {/* Profile Header */}
      <div className="relative">
        {/* Cover Image */}
        <div className="h-64 bg-gradient-to-r from-rose-400 to-orange-400 relative">
          {userProfile.coverImage ? (
            <img 
              src={userProfile.coverImage} 
              alt="Cover" 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-rose-400 to-orange-400" />
          )}
          <button
            onClick={() => handleImageUpload('cover')}
            className="absolute bottom-4 right-4 bg-white/90 p-2 rounded-full hover:bg-white transition-colors"
          >
            <FaCamera className="text-gray-600" />
          </button>
        </div>

        {/* Profile Info */}
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative -mt-16">
            <div className="flex items-end space-x-4">
              <div className="relative">
                {userProfile.profileImage ? (
                  <img 
                    src={userProfile.profileImage} 
                    alt="Profile" 
                    className="w-32 h-32 rounded-full border-4 border-white object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full border-4 border-white bg-white flex items-center justify-center">
                    <FaUserCircle className="w-full h-full text-gray-300" />
                  </div>
                )}
                <button
                  onClick={() => handleImageUpload('profile')}
                  className="absolute bottom-0 right-0 bg-white p-2 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <FaCamera className="text-gray-600" />
                </button>
              </div>
              <div className="flex-1 pb-4">
                <h1 className="text-2xl font-bold text-gray-800">{userProfile.name}</h1>
                <div className="flex items-center space-x-4 text-gray-600 mt-1">
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="mr-1" />
                    <span>{userProfile.location}</span>
                  </div>
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-1" />
                    <span>Joined {userProfile.joinDate}</span>
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-4 text-gray-600">{userProfile.bio}</p>
          </div>

          {/* Stats */}
          <div className="flex space-x-8 mt-6 border-b border-gray-200 pb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{savedRecipes.length}</div>
              <div className="text-gray-600">Saved Recipes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{likedRecipes.length}</div>
              <div className="text-gray-600">Liked Recipes</div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex space-x-8 mt-4">
            <button
              onClick={() => setActiveTab('saved')}
              className={`pb-2 px-1 ${
                activeTab === 'saved'
                  ? 'border-b-2 border-rose-500 text-rose-500'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FaBookmark className="inline mr-2" />
              Saved Recipes
            </button>
            <button
              onClick={() => setActiveTab('liked')}
              className={`pb-2 px-1 ${
                activeTab === 'liked'
                  ? 'border-b-2 border-rose-500 text-rose-500'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FaHeart className="inline mr-2" />
              Liked Recipes
            </button>
            <button
              onClick={() => setActiveTab('joinedChallenges')}
              className={`pb-2 px-1 ${
                activeTab === 'joinedChallenges'
                  ? 'border-b-2 border-green-500 text-green-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FaUtensils className="inline mr-2" />
              Joined Challenges
            </button>
          </div>
        </div>
      </div>

      {/* Recipe/Challenge Grid */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto"></div>
          </div>
        ) : (
          <>
            {activeTab === 'saved' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {savedRecipes.map(recipe => (
                  <motion.div
                    key={recipe.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  >
                    <img
                      src={getImageUrl(recipe.recipeImage)}
                      alt={recipe.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{recipe.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{recipe.description}</p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <FaClock className="mr-1" />
                            <span>{recipe.time}</span>
                          </div>
                          <div className="flex items-center">
                            <FaUtensils className="mr-1" />
                            <span>{recipe.type}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <button className="hover:text-rose-500 transition-colors">
                            <FaHeart className="text-rose-500" />
                          </button>
                          <button className="hover:text-rose-500 transition-colors">
                            <FaComment />
                          </button>
                          <button className="hover:text-rose-500 transition-colors">
                            <FaShareAlt />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            {activeTab === 'liked' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {likedRecipes.map(recipe => (
                  <motion.div
                    key={recipe.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  >
                    <img
                      src={getImageUrl(recipe.recipeImage)}
                      alt={recipe.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{recipe.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{recipe.description}</p>
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <FaClock className="mr-1" />
                            <span>{recipe.time}</span>
                          </div>
                          <div className="flex items-center">
                            <FaUtensils className="mr-1" />
                            <span>{recipe.type}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <button className="hover:text-rose-500 transition-colors">
                            <FaHeart className="text-rose-500" />
                          </button>
                          <button className="hover:text-rose-500 transition-colors">
                            <FaComment />
                          </button>
                          <button className="hover:text-rose-500 transition-colors">
                            <FaShareAlt />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
            {activeTab === 'joinedChallenges' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {joinedChallenges.length === 0 ? (
                  <div className="col-span-2 text-center text-gray-500 py-8">
                    You haven't joined any challenges yet.
                  </div>
                ) : (
                  joinedChallenges.map((challenge, idx) => (
                    <div key={idx} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 p-6 flex flex-col">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{challenge.ChallengeTitle}</h3>
                      <p className="text-gray-600 text-sm mb-2">{challenge.challengeDetails}</p>
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <FaCalendarAlt className="mr-1" />
                        <span>{challenge.startDate} - {challenge.endDate}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <FaUtensils className="mr-1" />
                        <span>Rules: {challenge.rules}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Profile; 