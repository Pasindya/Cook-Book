import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { 
  FaHeart, FaRegHeart, FaShareAlt, FaClock, 
  FaUtensils, FaEllipsisH, FaRegBookmark, 
  FaBookmark, FaFireAlt, FaLeaf, FaBreadSlice,
  FaEdit, FaTrash, FaComment, FaUser,
  FaStar, FaRegStar, FaThumbsUp, FaRegThumbsUp,
  FaCamera, FaMapMarkerAlt, FaUserFriends, FaBookOpen,
  FaStarHalfAlt
} from 'react-icons/fa';
import { GiMeal, GiFruitBowl, GiChickenOven } from 'react-icons/gi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function DisplayRecipe() {
    const [recipes, setRecipes] = useState([]);
    const [expandedRecipe, setExpandedRecipe] = useState(null);
    const [savedRecipes, setSavedRecipes] = useState([]);
    const [likedRecipes, setLikedRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showMenu, setShowMenu] = useState(null);
    const [showCommentInput, setShowCommentInput] = useState(null);
    const [showReviewInput, setShowReviewInput] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [newReview, setNewReview] = useState({ rating: 0, text: '' });
    const [activeTab, setActiveTab] = useState('all'); // 'all', 'saved', 'liked'
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedFilters, setSelectedFilters] = useState({
        type: [],
        time: null,
        difficulty: null
    });
    const { id } = useParams();
    const navigate = useNavigate();
    const [reviews, setReviews] = useState({}); // { [recipeId]: [review, ...] }
    const [editingReview, setEditingReview] = useState({}); // { [recipeId]: reviewObj }
    const [reviewLoading, setReviewLoading] = useState({}); // { [recipeId]: boolean }
    const [reviewSectionState, setReviewSectionState] = useState({});

    const handleImageError = (e) => {
        e.target.onerror = null;
        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjI1MCIgZmlsbD0iI2YwZjBmMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZSBhdmFpbGFibGU8L3RleHQ+PC9zdmc+';
    };

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
            const result = await axios.get(`http://localhost:8080/api/recipes`);
            setRecipes(result.data);
        } catch (error) {
            console.error("Error loading recipes:", error);
            toast.error(error.response?.data?.error || 'Failed to load recipes');
        } finally {
            setLoading(false);
        }
    };

    const toggleExpand = (recipeId) => {
        setExpandedRecipe(expandedRecipe === recipeId ? null : recipeId);
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

    const toggleLike = (recipeId) => {
        let updatedLikedRecipes;
        if (likedRecipes.includes(recipeId)) {
            updatedLikedRecipes = likedRecipes.filter(id => id !== recipeId);
        } else {
            updatedLikedRecipes = [...likedRecipes, recipeId];
            toast('❤️ Liked!', { autoClose: 1000 });
        }
        setLikedRecipes(updatedLikedRecipes);
        localStorage.setItem('likedRecipes', JSON.stringify(updatedLikedRecipes));
    };

    const toggleMenu = (recipeId, e) => {
        e.stopPropagation();
        setShowMenu(showMenu === recipeId ? null : recipeId);
    };

    const handleDelete = async (recipeId) => {
        if (window.confirm('Are you sure you want to delete this recipe?')) {
            try {
                setLoading(true);
                console.log('Deleting recipe with ID:', recipeId);
                
                const response = await axios.delete(`http://localhost:8080/api/recipes/${recipeId}`);
                
                if (response.status === 200) {
                    setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.id !== recipeId));
                    toast.success('Recipe deleted successfully');
                    setShowMenu(null);
                    await loadRecipes();
                }
            } catch (error) {
                console.error('Error deleting recipe:', error);
                toast.error(error.response?.data?.error || 'Failed to delete recipe');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleEdit = (id) => {
        navigate(`/recipes/edit/${id}`);
    };

    const toggleCommentInput = (recipeId) => {
        setShowCommentInput(showCommentInput === recipeId ? null : recipeId);
        setShowReviewInput(null);
    };

    const toggleReviewInput = (recipeId) => {
        setShowReviewInput(showReviewInput === recipeId ? null : recipeId);
        setNewReview({ rating: 0, text: '' });
        fetchReviews(recipeId);
    };

    const handleCommentSubmit = (recipeId) => {
        if (!newComment.trim()) return;
        
        // Here you would typically send the comment to your backend
        toast.success('Comment submitted! (Would be saved to database in production)');
        setNewComment('');
        setShowCommentInput(null);
    };

    const handleReviewSubmit = async (recipeId) => {
        try {
            if (!newReview.rating || !newReview.text.trim()) {
                toast.error('Please provide both rating and review text');
                return;
            }
            await axios.post(`http://localhost:8080/api/recipes/${recipeId}/reviews`, {
                rating: newReview.rating,
                comment: newReview.text,
                userId: 'demoUser' // Replace with real userId if available
            });
            toast.success('Review submitted successfully!');
            setShowReviewInput(null);
            setNewReview({ rating: 0, text: '' });
            fetchReviews(recipeId);
        } catch (error) {
            toast.error('Failed to submit review');
        }
    };

    const handleEditReview = (recipeId, review) => {
        setEditingReview(prev => ({ ...prev, [recipeId]: review }));
        setNewReview({ rating: review.rating, text: review.comment });
        setShowReviewInput(recipeId);
    };

    const handleUpdateReview = async (recipeId, reviewId) => {
        try {
            await axios.put(`http://localhost:8080/api/reviews/${reviewId}`, {
                rating: newReview.rating,
                comment: newReview.text,
                userId: 'demoUser' // Replace with real userId if available
            });
            toast.success('Review updated!');
            setShowReviewInput(null);
            setEditingReview(prev => ({ ...prev, [recipeId]: null }));
            setNewReview({ rating: 0, text: '' });
            fetchReviews(recipeId);
        } catch (error) {
            toast.error('Failed to update review');
        }
    };

    const handleDeleteReview = async (recipeId, reviewId) => {
        try {
            await axios.delete(`http://localhost:8080/api/reviews/${reviewId}`);
            toast.success('Review deleted!');
            fetchReviews(recipeId);
        } catch (error) {
            toast.error('Failed to delete review');
        }
    };

    const formatTime = (minutes) => {
        if (!minutes) return "Not specified";
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours > 0 ? `${hours}h ` : ''}${mins > 0 ? `${mins}m` : ''}`;
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

    const shareRecipe = async (recipe) => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: recipe.title,
                    text: `Check out this delicious ${recipe.type} recipe! Cooking time: ${formatTime(recipe.time)}`,
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

    const filteredRecipes = recipes.filter(recipe => {
        if (activeTab === 'saved') return savedRecipes.includes(recipe.id);
        if (activeTab === 'liked') return likedRecipes.includes(recipe.id);
        if (searchQuery) {
            return recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   recipe.description.toLowerCase().includes(searchQuery.toLowerCase());
        }
        if (selectedFilters.type.length > 0 && !selectedFilters.type.includes(recipe.type)) {
            return false;
        }
        if (selectedFilters.time && recipe.time > selectedFilters.time) {
            return false;
        }
        if (selectedFilters.difficulty && recipe.difficulty !== selectedFilters.difficulty) {
            return false;
        }
        return true;
    });

    const fetchReviews = async (recipeId) => {
        setReviewLoading(prev => ({ ...prev, [recipeId]: true }));
        try {
            const res = await axios.get(`http://localhost:8080/api/recipes/${recipeId}/reviews`);
            setReviews(prev => ({ ...prev, [recipeId]: res.data }));
        } catch (e) {
            toast.error('Failed to load reviews');
        } finally {
            setReviewLoading(prev => ({ ...prev, [recipeId]: false }));
        }
    };

    // Add helper to calculate average and breakdown
    const getReviewStats = (reviewsArr) => {
        if (!reviewsArr || reviewsArr.length === 0) {
            return {
                avg: null,
                count: 0,
                breakdown: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
            };
        }
        const breakdown = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
        let sum = 0;
        reviewsArr.forEach(r => {
            breakdown[r.rating] = (breakdown[r.rating] || 0) + 1;
            sum += r.rating;
        });
        return {
            avg: (sum / reviewsArr.length).toFixed(1),
            count: reviewsArr.length,
            breakdown
        };
    };

    const handleStarClick = (recipeId) => {
        setReviewSectionState(prev => ({
            ...prev,
            [recipeId]: prev[recipeId] === 'expanded' ? 'collapsed' : 'expanded'
        }));
        if (!reviews[recipeId]) fetchReviews(recipeId);
    };

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
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Discover Delicious Recipes</h1>
                        <p className="text-xl mb-8">Find and share your favorite recipes with the community</p>
                        <div className="max-w-2xl mx-auto">
                            <div className="flex items-center bg-white rounded-full p-2 shadow-lg">
                                <input
                                    type="text"
                                    placeholder="Search for recipes..."
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

            {/* Main Content */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Quick Filters */}
                <div className="flex flex-wrap gap-4 mb-8">
                    <button 
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center space-x-2 px-4 py-2 bg-white rounded-full shadow-sm hover:shadow-md transition-shadow text-rose-500"
                    >
                        <FaCamera />
                        <span>Filters</span>
                    </button>
                    {['Vegetarian', 'Vegan', 'Meat', 'Dessert', 'Spicy'].map(type => (
                        <button
                            key={type}
                            onClick={() => {
                                const newTypes = selectedFilters.type.includes(type)
                                    ? selectedFilters.type.filter(t => t !== type)
                                    : [...selectedFilters.type, type];
                                setSelectedFilters({...selectedFilters, type: newTypes});
                            }}
                            className={`px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-shadow ${
                                selectedFilters.type.includes(type)
                                    ? 'bg-rose-300 text-gray-800'
                                    : 'bg-white text-rose-500'
                            }`}
                        >
                            {type}
                        </button>
                    ))}
                </div>

                {/* Filter Panel */}
                {showFilters && (
                    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Recipe Type</h3>
                                <div className="space-y-3">
                                    {['Vegetarian', 'Vegan', 'Meat', 'Dessert', 'Spicy'].map(type => (
                                        <label key={type} className="flex items-center space-x-3">
                                            <input
                                                type="checkbox"
                                                checked={selectedFilters.type.includes(type)}
                                                onChange={(e) => {
                                                    const newTypes = e.target.checked
                                                        ? [...selectedFilters.type, type]
                                                        : selectedFilters.type.filter(t => t !== type);
                                                    setSelectedFilters({...selectedFilters, type: newTypes});
                                                }}
                                                className="w-5 h-5 rounded text-rose-500"
                                            />
                                            <span className="text-gray-700">{type}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Cooking Time</h3>
                                <select
                                    value={selectedFilters.time || ''}
                                    onChange={(e) => setSelectedFilters({...selectedFilters, time: e.target.value ? parseInt(e.target.value) : null})}
                                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                                >
                                    <option value="">Any time</option>
                                    <option value="30">Under 30 minutes</option>
                                    <option value="60">Under 1 hour</option>
                                    <option value="120">Under 2 hours</option>
                                </select>
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold mb-4">Difficulty</h3>
                                <select
                                    value={selectedFilters.difficulty || ''}
                                    onChange={(e) => setSelectedFilters({...selectedFilters, difficulty: e.target.value || null})}
                                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                                >
                                    <option value="">Any difficulty</option>
                                    <option value="easy">Easy</option>
                                    <option value="medium">Medium</option>
                                    <option value="hard">Hard</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {/* Recipe Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredRecipes.map(recipe => (
                        <div key={recipe.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
                            {/* Recipe Image with Overlay */}
                            <div className="relative group">
                                <img
                                    src={getImageUrl(recipe.recipeImage)}
                                    alt={recipe.title}
                                    onError={handleImageError}
                                    className="w-full h-64 object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="absolute bottom-4 left-4 right-4">
                                        <div className="flex items-center space-x-4 text-white">
                                            <div className="flex items-center">
                                                <FaClock className="mr-2" />
                                                <span>{formatTime(recipe.time)}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <FaUtensils className="mr-2" />
                                                <span>{recipe.servings || 'N/A'} servings</span>
                                            </div>
                                            <div className="flex items-center">
                                                <FaBookOpen className="mr-2" />
                                                <span>{recipe.difficulty || 'Medium'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="absolute top-4 right-4 bg-white/90 rounded-full p-2 shadow-md">
                                    {getTypeIcon(recipe.type)}
                                </div>
                            </div>

                            {/* Recipe Content */}
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center overflow-hidden">
                                            {recipe.authorImage ? (
                                                <img src={recipe.authorImage} alt={recipe.author} className="w-full h-full object-cover" />
                                            ) : (
                                                <FaUser className="text-rose-400" />
                                            )}
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
                                    <button 
                                        onClick={(e) => toggleMenu(recipe.id, e)}
                                        className="p-2 hover:bg-rose-50 rounded-full text-rose-400"
                                    >
                                        <FaEllipsisH />
                                    </button>
                                </div>

                                <h2 className="text-xl font-bold mb-2 text-gray-800">{recipe.title}</h2>
                                <p className="text-gray-600 mb-4 line-clamp-2">{recipe.description}</p>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {recipe.tags?.map(tag => (
                                        <span key={tag} className="px-3 py-1 bg-rose-50 rounded-full text-sm text-rose-500 hover:bg-rose-100 transition-colors">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Engagement Bar */}
                                <div className="flex items-center justify-between border-t border-rose-100 pt-4">
                                    <button 
                                        onClick={() => toggleLike(recipe.id)}
                                        className="flex items-center space-x-2 text-gray-500 hover:text-rose-400 transition-colors"
                                    >
                                        {likedRecipes.includes(recipe.id) ? 
                                            <FaHeart className="text-rose-400" /> : 
                                            <FaRegHeart />
                                        }
                                        <span>{recipe.likes || 0}</span>
                                    </button>
                                    <button 
                                        onClick={() => toggleCommentInput(recipe.id)}
                                        className="flex items-center space-x-2 text-gray-500 hover:text-rose-400 transition-colors"
                                    >
                                        <FaComment />
                                        <span>{recipe.comments?.length || 0}</span>
                                    </button>
                                    <button 
                                        onClick={() => handleStarClick(recipe.id)}
                                        className="flex items-center space-x-2 text-gray-500 hover:text-rose-400 transition-colors"
                                    >
                                        <FaStar />
                                        <span>{reviews[recipe.id]?.length || 0}</span>
                                    </button>
                                    <button 
                                        onClick={() => shareRecipe(recipe)}
                                        className="flex items-center space-x-2 text-gray-500 hover:text-rose-400 transition-colors"
                                    >
                                        <FaShareAlt />
                                        <span>Share</span>
                                    </button>
                                    <button 
                                        onClick={() => toggleSave(recipe.id)}
                                        className="flex items-center space-x-2 text-gray-500 hover:text-rose-400 transition-colors"
                                    >
                                        {savedRecipes.includes(recipe.id) ? 
                                            <FaBookmark className="text-rose-400" /> : 
                                            <FaRegBookmark />
                                        }
                                        <span>Save</span>
                                    </button>
                                </div>

                                {/* Comments Section */}
                                {showCommentInput === recipe.id && (
                                    <div className="mt-4">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
                                                <FaUser className="text-rose-400" />
                                            </div>
                                            <textarea
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                                placeholder="Write a comment..."
                                                className="flex-1 p-2 border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent"
                                                rows="2"
                                            />
                                        </div>
                                        <div className="flex justify-end">
                                            <button
                                                onClick={() => handleCommentSubmit(recipe.id)}
                                                className="px-4 py-2 bg-rose-300 text-gray-800 rounded-lg hover:bg-rose-400 transition-colors"
                                            >
                                                Post Comment
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Review Input Section */}
                                {showReviewInput === recipe.id && (
                                    <div className="mt-4 p-4 bg-rose-50 rounded-lg">
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                                            <div className="flex space-x-2">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                                                        className="text-2xl text-gray-400 hover:text-rose-400 transition-colors"
                                                    >
                                                        {star <= newReview.rating ? <FaStar className="text-rose-400" /> : <FaRegStar />}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <textarea
                                            value={newReview.text}
                                            onChange={(e) => setNewReview(prev => ({ ...prev, text: e.target.value }))}
                                            placeholder="Write your review..."
                                            className="w-full p-3 border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-transparent"
                                            rows="3"
                                        />
                                        <div className="mt-3 flex justify-end space-x-3">
                                            <button
                                                onClick={() => setShowReviewInput(null)}
                                                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => editingReview[recipe.id] ? handleUpdateReview(recipe.id, editingReview[recipe.id].id) : handleReviewSubmit(recipe.id)}
                                                className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
                                            >
                                                {editingReview[recipe.id] ? 'Update Review' : 'Submit Review'}
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {reviewSectionState[recipe.id] === 'expanded' && (
                                    <>
                                        {/* Review summary and list */}
                                        <div className="mt-4 mb-4 p-4 bg-white rounded shadow-sm">
                                            <div className="mb-2 font-bold text-lg flex items-center text-yellow-500">
                                                <FaStar className="mr-1" /> Reviews
                                            </div>
                                            {(() => {
                                                const stats = getReviewStats(reviews[recipe.id]);
                                                return (
                                                    <div className="flex flex-col md:flex-row md:items-center md:space-x-8">
                                                        <div className="flex flex-col items-center md:items-start mb-4 md:mb-0">
                                                            <div className="flex items-center">
                                                                <span className="text-4xl font-bold text-yellow-500 mr-2">{stats.avg ? stats.avg : 'N/A'}</span>
                                                                <div className="flex">
                                                                    {[1,2,3,4,5].map(star => (
                                                                        <span key={star}>
                                                                            {stats.avg && star <= Math.round(stats.avg) ? <FaStar className="text-yellow-400 text-2xl" /> : <FaRegStar className="text-yellow-300 text-2xl" />}
                                                                        </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                            <div className="text-gray-600 text-sm mt-1">{stats.count} review{stats.count !== 1 ? 's' : ''}</div>
                                                        </div>
                                                        <div className="flex-1">
                                                            {[5,4,3,2,1].map(star => (
                                                                <div key={star} className="flex items-center text-sm mb-1">
                                                                    <span className="w-10 text-gray-600">{star} star</span>
                                                                    <div className="flex-1 bg-gray-200 rounded h-2 mx-2">
                                                                        <div style={{ width: stats.count ? `${(stats.breakdown[star] / stats.count) * 100}%` : '0%' }} className={`bg-yellow-400 h-2 rounded`}></div>
                                                                    </div>
                                                                    <span className="w-4 text-gray-600">{stats.breakdown[star]}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                );
                                            })()}
                                        </div>
                                        <div className="mt-4">
                                            <h4 className="font-semibold mb-2">Reviews:</h4>
                                            {reviewLoading[recipe.id] ? (
                                                <div>Loading reviews...</div>
                                            ) : reviews[recipe.id].length === 0 ? (
                                                <div>No reviews yet. Be the first to review!</div>
                                            ) : (
                                                reviews[recipe.id].map((review) => (
                                                    <div key={review.id} className="mb-2 p-2 bg-gray-50 rounded">
                                                        <div className="flex items-center mb-1">
                                                            {[1,2,3,4,5].map(star => (
                                                                star <= review.rating ? <FaStar key={star} className="text-yellow-400" /> : <FaRegStar key={star} className="text-gray-300" />
                                                            ))}
                                                            <span className="ml-2 text-sm text-gray-600">{review.comment}</span>
                                                        </div>
                                                        <div className="flex items-center text-xs text-gray-400">
                                                            <span>User: {review.userId}</span>
                                                            <>
                                                                {review.userId === 'demoUser' && (
                                                                    <button
                                                                        onClick={() => handleEditReview(recipe.id, review)}
                                                                        className="flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full hover:bg-blue-500 hover:text-white transition-colors duration-200 mr-2"
                                                                        title="Edit Review"
                                                                    >
                                                                        <FaEdit className="mr-1" /> Edit
                                                                    </button>
                                                                )}
                                                                <button
                                                                    onClick={() => handleDeleteReview(recipe.id, review.id)}
                                                                    className="flex items-center px-3 py-1 bg-red-100 text-red-700 rounded-full hover:bg-red-500 hover:text-white transition-colors duration-200"
                                                                    title="Delete Review"
                                                                >
                                                                    <FaTrash className="mr-1" /> Delete
                                                                </button>
                                                            </>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                        {/* Add review form */}
                                        <div className="mt-4 p-4 bg-rose-50 rounded-lg">
                                            <div className="mb-4">
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                                                <div className="flex space-x-2">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <button
                                                            key={star}
                                                            onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                                                            className="text-2xl text-gray-400 hover:text-rose-400 transition-colors"
                                                        >
                                                            {star <= newReview.rating ? <FaStar className="text-rose-400" /> : <FaRegStar />}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <textarea
                                                value={newReview.text}
                                                onChange={(e) => setNewReview(prev => ({ ...prev, text: e.target.value }))}
                                                placeholder="Write your review..."
                                                className="w-full p-3 border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-400 focus:border-transparent"
                                                rows="3"
                                            />
                                            <div className="mt-3 flex justify-end space-x-3">
                                                <button
                                                    onClick={() => setReviewSectionState(prev => ({ ...prev, [recipe.id]: 'collapsed' }))}
                                                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => handleReviewSubmit(recipe.id)}
                                                    className="px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
                                                >
                                                    Submit Review
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Recipe Actions */}
                                {showMenu === recipe.id && (
                                    <div className="absolute right-4 top-12 bg-white rounded-lg shadow-lg border border-rose-100 z-50">
                                        <button
                                            onClick={() => handleEdit(recipe.id)}
                                            className="flex items-center space-x-2 px-4 py-2 hover:bg-rose-50 w-full text-rose-500"
                                        >
                                            <FaEdit />
                                            <span>Edit Recipe</span>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(recipe.id)}
                                            className="flex items-center space-x-2 px-4 py-2 hover:bg-rose-50 w-full text-red-400"
                                        >
                                            <FaTrash />
                                            <span>Delete Recipe</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default DisplayRecipe;