import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { 
  FaHeart, 
  FaRegHeart, 
  FaShareAlt, 
  FaClock, 
  FaUtensils, 
  FaComment,
  FaUser,
  FaBookmark,
  FaRegBookmark,
  FaLeaf,
  FaFireAlt,
  FaBreadSlice,
  FaSearch,
  FaFilter,
  FaMapMarkerAlt,
  FaBookOpen,
  FaStar,
  FaRegStar
} from 'react-icons/fa';
import { GiMeal, GiFruitBowl, GiChickenOven, GiCook } from 'react-icons/gi';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AllRecipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedRecipes, setLikedRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [showCommentInput, setShowCommentInput] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    type: [],
    time: null,
    difficulty: null
  });

  useEffect(() => {
    loadRecipes();
    const saved = JSON.parse(localStorage.getItem('savedRecipes')) || [];
    const liked = JSON.parse(localStorage.getItem('likedRecipes')) || [];
    setSavedRecipes(saved);
    setLikedRecipes(liked);
  }, []);

  const loadRecipes = async () => {
    try {
      setLoading(true);
      const result = await axios.get('http://localhost:8080/api/recipes');
      setRecipes(result.data);
    } catch (error) {
      console.error('Error loading recipes:', error);
      toast.error('Failed to load recipes');
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = (recipeId) => {
    let updatedLikedRecipes;
    if (likedRecipes.includes(recipeId)) {
      updatedLikedRecipes = likedRecipes.filter(id => id !== recipeId);
      toast.info('Recipe unliked');
    } else {
      updatedLikedRecipes = [...likedRecipes, recipeId];
      toast.success('Recipe liked!');
    }
    setLikedRecipes(updatedLikedRecipes);
    localStorage.setItem('likedRecipes', JSON.stringify(updatedLikedRecipes));
  };

  const toggleSave = (recipeId) => {
    let updatedSavedRecipes;
    if (savedRecipes.includes(recipeId)) {
      updatedSavedRecipes = savedRecipes.filter(id => id !== recipeId);
      toast.info('Recipe removed from saved');
    } else {
      updatedSavedRecipes = [...savedRecipes, recipeId];
      toast.success('Recipe saved!');
    }
    setSavedRecipes(updatedSavedRecipes);
    localStorage.setItem('savedRecipes', JSON.stringify(updatedSavedRecipes));
  };

  const toggleCommentInput = (recipeId) => {
    setShowCommentInput(showCommentInput === recipeId ? null : recipeId);
  };

  const handleCommentSubmit = (recipeId) => {
    if (!newComment.trim()) return;
    
    const updatedComments = {
      ...comments,
      [recipeId]: [...(comments[recipeId] || []), {
        id: Date.now(),
        text: newComment,
        user: 'Current User',
        timestamp: new Date().toISOString()
      }]
    };
    
    setComments(updatedComments);
    setNewComment('');
    setShowCommentInput(null);
    toast.success('Comment added!');
  };

  const shareRecipe = async (recipe) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: recipe.title,
          text: `Check out this delicious ${recipe.type} recipe!`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.info('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Failed to share recipe');
    }
  };

  const getImageUrl = (recipeImage) => {
    if (!recipeImage) return 'https://via.placeholder.com/400x250?text=Recipe+Image';
    return `http://localhost:8080/api/recipes/images/${recipeImage}`;
  };

  const getTypeIcon = (type) => {
    switch(type?.toLowerCase()) {
      case 'vegetarian': return <FaLeaf className="text-green-500" />;
      case 'vegan': return <GiFruitBowl className="text-green-600" />;
      case 'meat': return <GiChickenOven className="text-red-500" />;
      case 'dessert': return <FaBreadSlice className="text-yellow-500" />;
      case 'spicy': return <FaFireAlt className="text-red-600" />;
      default: return <GiMeal className="text-gray-500" />;
    }
  };

  const filteredRecipes = recipes.filter(recipe => {
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = selectedType === 'all' || recipe.type.toLowerCase() === selectedType.toLowerCase();
    return matchesSearch && matchesType;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-rose-50">
      <Navbar />
      
      {/* Hero Section with Parallax Effect */}
      <div className="relative h-[60vh] overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3')] bg-cover bg-center bg-fixed">
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50"></div>
        </div>
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div className="max-w-4xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-6xl font-bold text-white mb-6"
            >
              Discover Culinary Delights
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-white/90 mb-8"
            >
              Explore, create, and share your favorite recipes with food lovers worldwide
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="max-w-2xl mx-auto"
            >
              <div className="flex items-center bg-white/95 backdrop-blur-sm rounded-full p-2 shadow-xl">
                <input
                  type="text"
                  placeholder="Search for recipes, ingredients, or cuisines..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 px-6 py-4 text-gray-800 bg-transparent focus:outline-none text-lg"
                />
                <button className="bg-rose-500 text-white px-8 py-4 rounded-full hover:bg-rose-600 transition-colors flex items-center space-x-2">
                  <FaSearch className="text-xl" />
                  <span className="hidden md:inline">Search</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 -mt-16 relative z-10">
        {/* Quick Filters */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-wrap items-center gap-4">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-6 py-3 bg-rose-500 text-white rounded-full hover:bg-rose-600 transition-colors shadow-md"
            >
              <FaFilter />
              <span>Advanced Filters</span>
            </button>
            <div className="flex-1 flex flex-wrap gap-3">
              {['Vegetarian', 'Vegan', 'Meat', 'Dessert', 'Spicy'].map(type => (
                <button
                  key={type}
                  onClick={() => {
                    const newTypes = selectedFilters.type.includes(type)
                      ? selectedFilters.type.filter(t => t !== type)
                      : [...selectedFilters.type, type];
                    setSelectedFilters({...selectedFilters, type: newTypes});
                  }}
                  className={`px-5 py-2.5 rounded-full shadow-sm hover:shadow-md transition-all transform hover:-translate-y-0.5 ${
                    selectedFilters.type.includes(type)
                      ? 'bg-rose-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-6 border-t border-gray-100"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Recipe Type</h3>
                  <div className="space-y-3">
                    {['Vegetarian', 'Vegan', 'Meat', 'Dessert', 'Spicy'].map(type => (
                      <label key={type} className="flex items-center space-x-3 group cursor-pointer">
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={selectedFilters.type.includes(type)}
                            onChange={(e) => {
                              const newTypes = e.target.checked
                                ? [...selectedFilters.type, type]
                                : selectedFilters.type.filter(t => t !== type);
                              setSelectedFilters({...selectedFilters, type: newTypes});
                            }}
                            className="w-5 h-5 rounded border-2 border-gray-300 text-rose-500 focus:ring-rose-500 transition-colors"
                          />
                        </div>
                        <span className="text-gray-700 group-hover:text-rose-500 transition-colors">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Cooking Time</h3>
                  <select
                    value={selectedFilters.time || ''}
                    onChange={(e) => setSelectedFilters({...selectedFilters, time: e.target.value ? parseInt(e.target.value) : null})}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Any time</option>
                    <option value="30">Under 30 minutes</option>
                    <option value="60">Under 1 hour</option>
                    <option value="120">Under 2 hours</option>
                  </select>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Difficulty Level</h3>
                  <select
                    value={selectedFilters.difficulty || ''}
                    onChange={(e) => setSelectedFilters({...selectedFilters, difficulty: e.target.value || null})}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Any difficulty</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Recipe Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRecipes.map(recipe => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
            >
              {/* Recipe Image with Overlay */}
              <div className="relative group">
                <img
                  src={getImageUrl(recipe.recipeImage)}
                  alt={recipe.title}
                  className="w-full h-72 object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center justify-between text-white">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                          <FaClock className="mr-2" />
                          <span>{recipe.time}</span>
                        </div>
                        <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                          <FaUtensils className="mr-2" />
                          <span>{recipe.servings || 'N/A'} servings</span>
                        </div>
                      </div>
                      <div className="flex items-center bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full">
                        <FaBookOpen className="mr-2" />
                        <span>{recipe.difficulty || 'Medium'}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg transform group-hover:scale-110 transition-transform duration-300">
                  {getTypeIcon(recipe.type)}
                </div>
              </div>

              {/* Recipe Content */}
              <div className="p-6">
                {/* Author Info */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-100 to-rose-200 flex items-center justify-center shadow-inner">
                      <FaUser className="text-rose-500 text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{recipe.author || 'Anonymous Chef'}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <span>{new Date(recipe.createdAt).toLocaleDateString()}</span>
                        {recipe.location && (
                          <>
                            <span>•</span>
                            <span className="flex items-center">
                              <FaMapMarkerAlt className="mr-1" />
                              {recipe.location}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <h2 className="text-2xl font-bold mb-3 text-gray-800 line-clamp-1">{recipe.title}</h2>
                <p className="text-gray-600 mb-4 line-clamp-2">{recipe.description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {recipe.tags?.map(tag => (
                    <span key={tag} className="px-3 py-1 bg-rose-50 rounded-full text-sm text-rose-500 hover:bg-rose-100 transition-colors">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Engagement Bar */}
                <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                  <div className="flex items-center space-x-6">
                    <button 
                      onClick={() => toggleLike(recipe.id)}
                      className="flex items-center space-x-2 text-gray-500 hover:text-rose-500 transition-colors group"
                    >
                      {likedRecipes.includes(recipe.id) ? 
                        <FaHeart className="text-rose-500 transform group-hover:scale-110 transition-transform" /> : 
                        <FaRegHeart className="transform group-hover:scale-110 transition-transform" />
                      }
                      <span className="group-hover:text-rose-500">{recipe.likes || 0}</span>
                    </button>
                    <button 
                      onClick={() => toggleCommentInput(recipe.id)}
                      className="flex items-center space-x-2 text-gray-500 hover:text-rose-500 transition-colors group"
                    >
                      <FaComment className="transform group-hover:scale-110 transition-transform" />
                      <span className="group-hover:text-rose-500">{comments[recipe.id]?.length || 0}</span>
                    </button>
                    <button 
                      onClick={() => shareRecipe(recipe)}
                      className="flex items-center space-x-2 text-gray-500 hover:text-rose-500 transition-colors group"
                    >
                      <FaShareAlt className="transform group-hover:scale-110 transition-transform" />
                      <span className="group-hover:text-rose-500">Share</span>
                    </button>
                  </div>
                  <button 
                    onClick={() => toggleSave(recipe.id)}
                    className="flex items-center space-x-2 text-gray-500 hover:text-rose-500 transition-colors group"
                  >
                    {savedRecipes.includes(recipe.id) ? 
                      <FaBookmark className="text-rose-500 transform group-hover:scale-110 transition-transform" /> : 
                      <FaRegBookmark className="transform group-hover:scale-110 transition-transform" />
                    }
                    <span className="group-hover:text-rose-500">Save</span>
                  </button>
                </div>

                {/* Comments Section */}
                {showCommentInput === recipe.id && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-100 to-rose-200 flex items-center justify-center">
                        <FaUser className="text-rose-500" />
                      </div>
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Share your thoughts..."
                        className="flex-1 p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent resize-none"
                        rows="2"
                      />
                    </div>
                    <div className="flex justify-end mt-3">
                      <button
                        onClick={() => handleCommentSubmit(recipe.id)}
                        className="px-6 py-2.5 bg-rose-500 text-white rounded-xl hover:bg-rose-600 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      >
                        Post Comment
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Display Comments */}
                {comments[recipe.id]?.length > 0 && (
                  <div className="mt-4 space-y-4">
                    {comments[recipe.id].map(comment => (
                      <motion.div 
                        key={comment.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex space-x-3"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-100 to-rose-200 flex items-center justify-center">
                          <FaUser className="text-rose-500" />
                        </div>
                        <div className="flex-1">
                          <div className="bg-gray-50 rounded-xl p-4 shadow-sm">
                            <p className="font-semibold text-gray-800">{comment.user}</p>
                            <p className="text-gray-600 mt-1">{comment.text}</p>
                          </div>
                          <p className="text-xs text-gray-500 mt-1.5">
                            {new Date(comment.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default AllRecipes; 