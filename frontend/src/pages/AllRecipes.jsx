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
  FaRegStar,
  FaSort,
  FaSortAmountDown,
  FaSortAmountUp,
  FaShoppingCart,
  FaUsers,
  FaRegThumbsUp,
  FaThumbsUp,
  FaShare,
  FaEllipsisH,
  FaThLarge,
  FaList,
  FaSun,
  FaMoon,
  FaTimes
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
  const [sortBy, setSortBy] = useState('newest');
  const [viewMode, setViewMode] = useState('grid');
  const [showCookMode, setShowCookMode] = useState(null);
  const [shoppingList, setShoppingList] = useState([]);
  const [recipeCollections, setRecipeCollections] = useState({});
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [selectedRecipeForCollection, setSelectedRecipeForCollection] = useState(null);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareMessage, setShareMessage] = useState('');
  const [selectedRecipeForShare, setSelectedRecipeForShare] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showFullRecipe, setShowFullRecipe] = useState(null);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

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
    // Search query filter
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         recipe.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Type filter
    const matchesType = selectedFilters.type.length === 0 || 
                       selectedFilters.type.includes(recipe.type);
    
    // Time filter
    const matchesTime = !selectedFilters.time || 
                       (recipe.time && recipe.time <= selectedFilters.time);
    
    // Difficulty filter
    const matchesDifficulty = !selectedFilters.difficulty || 
                            recipe.difficulty?.toLowerCase() === selectedFilters.difficulty.toLowerCase();

    // Apply all filters
    return matchesSearch && matchesType && matchesTime && matchesDifficulty;
  });

  const sortRecipes = (recipes) => {
    switch (sortBy) {
      case 'newest':
        return [...recipes].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'oldest':
        return [...recipes].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'popular':
        return [...recipes].sort((a, b) => (b.likes || 0) - (a.likes || 0));
      case 'timeAsc':
        return [...recipes].sort((a, b) => (a.time || 0) - (b.time || 0));
      case 'timeDesc':
        return [...recipes].sort((a, b) => (b.time || 0) - (a.time || 0));
      default:
        return recipes;
    }
  };

  const addToShoppingList = (recipe) => {
    const ingredients = recipe.ingredients.split('\n').map(ing => ing.trim());
    setShoppingList(prev => [...prev, ...ingredients]);
    toast.success('Ingredients added to shopping list!');
  };

  const toggleCookMode = (recipeId) => {
    setShowCookMode(showCookMode === recipeId ? null : recipeId);
  };

  const createCollection = () => {
    if (!newCollectionName.trim()) return;
    
    setRecipeCollections(prev => ({
      ...prev,
      [newCollectionName]: [...(prev[newCollectionName] || []), selectedRecipeForCollection]
    }));
    
    setNewCollectionName('');
    setShowCollectionModal(false);
    setSelectedRecipeForCollection(null);
    toast.success(`Recipe added to "${newCollectionName}" collection!`);
  };

  const shareRecipeWithMessage = async (recipe) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: recipe.title,
          text: shareMessage || `Check out this delicious ${recipe.type} recipe!`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(
          `${recipe.title}\n${shareMessage}\n${window.location.href}`
        );
        toast.info('Recipe link copied to clipboard!');
      }
      setShowShareModal(false);
      setShareMessage('');
      setSelectedRecipeForShare(null);
    } catch (error) {
      console.error('Error sharing:', error);
      toast.error('Failed to share recipe');
    }
  };

  const handleViewFullRecipe = (recipe) => {
    setSelectedRecipe(recipe);
    setShowFullRecipe(true);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-white' : 'bg-rose-50'}`}>
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
        {/* Advanced Controls */}
        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-xl p-6 mb-8`}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            {/* View Toggle */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-rose-500 text-white' : 'bg-gray-100'}`}
              >
                <FaThLarge />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-rose-500 text-white' : 'bg-gray-100'}`}
              >
                <FaList />
              </button>
            </div>

            {/* Sort Controls */}
            <div className="flex items-center space-x-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={`p-2 rounded-lg border ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'}`}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="popular">Most Popular</option>
                <option value="timeAsc">Quickest First</option>
                <option value="timeDesc">Longest First</option>
              </select>
            </div>

            {/* Dark Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-4 mt-4">
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
                    onChange={(e) => {
                      const value = e.target.value ? parseInt(e.target.value) : null;
                      setSelectedFilters({...selectedFilters, time: value});
                    }}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Any time</option>
                    <option value="15">Under 15 minutes</option>
                    <option value="30">Under 30 minutes</option>
                    <option value="45">Under 45 minutes</option>
                    <option value="60">Under 1 hour</option>
                    <option value="90">Under 1.5 hours</option>
                    <option value="120">Under 2 hours</option>
                  </select>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-800">Difficulty Level</h3>
                  <select
                    value={selectedFilters.difficulty || ''}
                    onChange={(e) => {
                      const value = e.target.value || null;
                      setSelectedFilters({...selectedFilters, difficulty: value});
                    }}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-colors"
                  >
                    <option value="">Any difficulty</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              {/* Active Filters Display */}
              {(selectedFilters.type.length > 0 || selectedFilters.time || selectedFilters.difficulty) && (
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-medium text-gray-600">Active Filters:</span>
                    {selectedFilters.type.map(type => (
                      <button
                        key={type}
                        onClick={() => {
                          setSelectedFilters({
                            ...selectedFilters,
                            type: selectedFilters.type.filter(t => t !== type)
                          });
                        }}
                        className="px-3 py-1 bg-rose-100 text-rose-600 rounded-full text-sm flex items-center space-x-1 hover:bg-rose-200 transition-colors"
                      >
                        <span>{type}</span>
                        <FaTimes className="text-xs" />
                      </button>
                    ))}
                    {selectedFilters.time && (
                      <button
                        onClick={() => {
                          setSelectedFilters({...selectedFilters, time: null});
                        }}
                        className="px-3 py-1 bg-rose-100 text-rose-600 rounded-full text-sm flex items-center space-x-1 hover:bg-rose-200 transition-colors"
                      >
                        <span>Under {selectedFilters.time} minutes</span>
                        <FaTimes className="text-xs" />
                      </button>
                    )}
                    {selectedFilters.difficulty && (
                      <button
                        onClick={() => {
                          setSelectedFilters({...selectedFilters, difficulty: null});
                        }}
                        className="px-3 py-1 bg-rose-100 text-rose-600 rounded-full text-sm flex items-center space-x-1 hover:bg-rose-200 transition-colors"
                      >
                        <span>{selectedFilters.difficulty}</span>
                        <FaTimes className="text-xs" />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedFilters({
                          type: [],
                          time: null,
                          difficulty: null
                        });
                      }}
                      className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-gray-200 transition-colors"
                    >
                      Clear All Filters
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </div>

        {/* Recipe Grid/List */}
        <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'}>
          {sortRecipes(filteredRecipes).map(recipe => (
            <motion.div
              key={recipe.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${
                viewMode === 'list' ? 'flex' : ''
              }`}
            >
              {/* Recipe Image */}
              <div className={`relative group ${viewMode === 'list' ? 'w-1/3' : ''}`}>
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
                <button
                  onClick={() => toggleCookMode(recipe.id)}
                  className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full text-rose-500 hover:bg-rose-500 hover:text-white transition-colors"
                >
                  <FaUtensils className="inline-block mr-2" />
                  Cook Mode
                </button>
              </div>

              {/* Recipe Content */}
              <div className={`p-6 ${viewMode === 'list' ? 'flex-1' : ''}`}>
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
                      onClick={() => {
                        setSelectedRecipeForShare(recipe);
                        setShowShareModal(true);
                      }}
                      className="text-gray-500 hover:text-rose-500 transition-colors"
                      title="Share Recipe"
                    >
                      <FaShare />
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

                {/* Advanced Actions */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => addToShoppingList(recipe)}
                      className="text-gray-500 hover:text-rose-500 transition-colors"
                      title="Add to Shopping List"
                    >
                      <FaShoppingCart />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedRecipeForCollection(recipe);
                        setShowCollectionModal(true);
                      }}
                      className="text-gray-500 hover:text-rose-500 transition-colors"
                      title="Add to Collection"
                    >
                      <FaBookmark />
                    </button>
                  </div>
                </div>

                {/* Add View Full Recipe Button */}
                <button
                  onClick={() => handleViewFullRecipe(recipe)}
                  className="w-full mt-4 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <FaBookOpen />
                  <span>View Full Recipe</span>
                </button>

                {/* Cook Mode Panel */}
                {showCookMode === recipe.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <h4 className="font-semibold mb-2">Cooking Steps</h4>
                    <ol className="list-decimal list-inside space-y-2">
                      {recipe.steps.split('\n').map((step, index) => (
                        <li key={index} className="text-gray-600">{step}</li>
                      ))}
                    </ol>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Collection Modal */}
      {showCollectionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Add to Collection</h3>
            <input
              type="text"
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              placeholder="New collection name"
              className="w-full p-2 border rounded-lg mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowCollectionModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={createCollection}
                className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
              >
                Create Collection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h3 className="text-xl font-semibold mb-4">Share Recipe</h3>
            <textarea
              value={shareMessage}
              onChange={(e) => setShareMessage(e.target.value)}
              placeholder="Add a message (optional)"
              className="w-full p-2 border rounded-lg mb-4 h-24"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={() => shareRecipeWithMessage(selectedRecipeForShare)}
                className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
              >
                Share
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Shopping List Sidebar */}
      {shoppingList.length > 0 && (
        <div className="fixed right-4 bottom-4 bg-white rounded-xl shadow-xl p-4 w-80">
          <h3 className="font-semibold mb-2">Shopping List</h3>
          <ul className="space-y-2 max-h-60 overflow-y-auto">
            {shoppingList.map((item, index) => (
              <li key={index} className="flex items-center justify-between">
                <span>{item}</span>
                <button
                  onClick={() => setShoppingList(prev => prev.filter((_, i) => i !== index))}
                  className="text-red-500 hover:text-red-600"
                >
                  <FaTimes />
                </button>
              </li>
            ))}
          </ul>
          <button
            onClick={() => setShoppingList([])}
            className="w-full mt-2 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600"
          >
            Clear List
          </button>
        </div>
      )}

      {/* Full Recipe Modal */}
      {showFullRecipe && selectedRecipe && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto`}
          >
            {/* Modal Header */}
            <div className="relative">
              <img
                src={getImageUrl(selectedRecipe.recipeImage)}
                alt={selectedRecipe.title}
                className="w-full h-64 object-cover rounded-t-2xl"
              />
              <button
                onClick={() => setShowFullRecipe(false)}
                className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 hover:bg-white transition-colors"
              >
                <FaTimes className="text-gray-600" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <h2 className="text-3xl font-bold text-white mb-2">{selectedRecipe.title}</h2>
                <div className="flex items-center space-x-4 text-white/90">
                  <div className="flex items-center">
                    <FaClock className="mr-2" />
                    <span>{selectedRecipe.time} minutes</span>
                  </div>
                  <div className="flex items-center">
                    <FaUtensils className="mr-2" />
                    <span>{selectedRecipe.servings || 'N/A'} servings</span>
                  </div>
                  <div className="flex items-center">
                    <FaBookOpen className="mr-2" />
                    <span>{selectedRecipe.difficulty || 'Medium'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Recipe Info */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-rose-100 to-rose-200 flex items-center justify-center">
                    <FaUser className="text-rose-500 text-xl" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{selectedRecipe.author || 'Anonymous Chef'}</h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-500">
                      <span>{new Date(selectedRecipe.createdAt).toLocaleDateString()}</span>
                      {selectedRecipe.location && (
                        <>
                          <span>•</span>
                          <span className="flex items-center">
                            <FaMapMarkerAlt className="mr-1" />
                            {selectedRecipe.location}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  {getTypeIcon(selectedRecipe.type)}
                  <span className="text-sm font-medium">{selectedRecipe.type}</span>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-2">Description</h3>
                <p className="text-gray-600">{selectedRecipe.description}</p>
              </div>

              {/* Ingredients */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Ingredients</h3>
                <div className="bg-gray-50 rounded-xl p-4">
                  <ul className="space-y-2">
                    {selectedRecipe.ingredients.split('\n').map((ingredient, index) => (
                      <li key={index} className="flex items-start space-x-3">
                        <span className="text-rose-500 mt-1">•</span>
                        <span>{ingredient.trim()}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => addToShoppingList(selectedRecipe)}
                  className="mt-4 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors flex items-center space-x-2"
                >
                  <FaShoppingCart />
                  <span>Add All to Shopping List</span>
                </button>
              </div>

              {/* Cooking Steps */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4">Cooking Steps</h3>
                <div className="space-y-4">
                  {selectedRecipe.steps.split('\n').map((step, index) => (
                    <div key={index} className="flex space-x-4 bg-gray-50 rounded-xl p-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-rose-500 text-white flex items-center justify-center font-semibold">
                        {index + 1}
                      </div>
                      <p className="text-gray-600">{step.trim()}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tags */}
              {selectedRecipe.tags?.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-xl font-semibold mb-4">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedRecipe.tags.map(tag => (
                      <span key={tag} className="px-3 py-1 bg-rose-50 rounded-full text-sm text-rose-500">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Engagement Bar */}
              <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                <div className="flex items-center space-x-6">
                  <button 
                    onClick={() => toggleLike(selectedRecipe.id)}
                    className="flex items-center space-x-2 text-gray-500 hover:text-rose-500 transition-colors group"
                  >
                    {likedRecipes.includes(selectedRecipe.id) ? 
                      <FaHeart className="text-rose-500" /> : 
                      <FaRegHeart />
                    }
                    <span>{selectedRecipe.likes || 0}</span>
                  </button>
                  <button 
                    onClick={() => toggleSave(selectedRecipe.id)}
                    className="flex items-center space-x-2 text-gray-500 hover:text-rose-500 transition-colors group"
                  >
                    {savedRecipes.includes(selectedRecipe.id) ? 
                      <FaBookmark className="text-rose-500" /> : 
                      <FaRegBookmark />
                    }
                    <span>Save Recipe</span>
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedRecipeForShare(selectedRecipe);
                      setShowShareModal(true);
                    }}
                    className="flex items-center space-x-2 text-gray-500 hover:text-rose-500 transition-colors group"
                  >
                    <FaShare />
                    <span>Share Recipe</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default AllRecipes; 