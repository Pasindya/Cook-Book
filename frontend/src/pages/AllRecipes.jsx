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
  FaBreadSlice
} from 'react-icons/fa';
import { GiMeal, GiFruitBowl, GiChickenOven } from 'react-icons/gi';
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Search and Filter Section */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search recipes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent"
          />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent"
          >
            <option value="all">All Types</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
            <option value="meat">Meat</option>
            <option value="dessert">Dessert</option>
            <option value="spicy">Spicy</option>
          </select>
        </div>
      </div>

      {/* Recipe Feed */}
      <div className="max-w-2xl mx-auto px-4 pb-8">
        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500 mx-auto"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredRecipes.map(recipe => (
              <motion.div
                key={recipe.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-md overflow-hidden"
              >
                {/* Recipe Header */}
                <div className="p-4 flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center">
                    <FaUser className="text-rose-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">{recipe.author || 'Anonymous Chef'}</h3>
                    <p className="text-sm text-gray-500">{new Date(recipe.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Recipe Image */}
                <img
                  src={getImageUrl(recipe.recipeImage)}
                  alt={recipe.title}
                  className="w-full h-64 object-cover"
                />

                {/* Recipe Content */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold text-gray-800">{recipe.title}</h2>
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(recipe.type)}
                      <span className="text-sm text-gray-600">{recipe.type}</span>
                    </div>
                  </div>
                  <p className="text-gray-600 mb-4">{recipe.description}</p>

                  {/* Recipe Details */}
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <FaClock className="mr-1" />
                      <span>{recipe.time}</span>
                    </div>
                    <div className="flex items-center">
                      <FaUtensils className="mr-1" />
                      <span>{recipe.servings || 'N/A'} servings</span>
                    </div>
                  </div>

                  {/* Engagement Bar */}
                  <div className="flex items-center justify-between border-t border-gray-100 pt-4">
                    <div className="flex items-center space-x-4">
                      <button 
                        onClick={() => toggleLike(recipe.id)}
                        className="flex items-center space-x-2 text-gray-500 hover:text-rose-500 transition-colors"
                      >
                        {likedRecipes.includes(recipe.id) ? 
                          <FaHeart className="text-rose-500" /> : 
                          <FaRegHeart />
                        }
                        <span>{recipe.likes || 0}</span>
                      </button>
                      <button 
                        onClick={() => toggleCommentInput(recipe.id)}
                        className="flex items-center space-x-2 text-gray-500 hover:text-rose-500 transition-colors"
                      >
                        <FaComment />
                        <span>{comments[recipe.id]?.length || 0}</span>
                      </button>
                      <button 
                        onClick={() => shareRecipe(recipe)}
                        className="flex items-center space-x-2 text-gray-500 hover:text-rose-500 transition-colors"
                      >
                        <FaShareAlt />
                        <span>Share</span>
                      </button>
                    </div>
                    <button 
                      onClick={() => toggleSave(recipe.id)}
                      className="flex items-center space-x-2 text-gray-500 hover:text-rose-500 transition-colors"
                    >
                      {savedRecipes.includes(recipe.id) ? 
                        <FaBookmark className="text-rose-500" /> : 
                        <FaRegBookmark />
                      }
                      <span>Save</span>
                    </button>
                  </div>

                  {/* Comments Section */}
                  {showCommentInput === recipe.id && (
                    <div className="mt-4">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
                          <FaUser className="text-rose-400" />
                        </div>
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Write a comment..."
                          className="flex-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent"
                          rows="2"
                        />
                      </div>
                      <div className="flex justify-end mt-2">
                        <button
                          onClick={() => handleCommentSubmit(recipe.id)}
                          className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
                        >
                          Post Comment
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Display Comments */}
                  {comments[recipe.id]?.length > 0 && (
                    <div className="mt-4 space-y-3">
                      {comments[recipe.id].map(comment => (
                        <div key={comment.id} className="flex space-x-3">
                          <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
                            <FaUser className="text-rose-400" />
                          </div>
                          <div className="flex-1">
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="font-semibold text-sm text-gray-800">{comment.user}</p>
                              <p className="text-gray-600 text-sm">{comment.text}</p>
                            </div>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(comment.timestamp).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AllRecipes; 