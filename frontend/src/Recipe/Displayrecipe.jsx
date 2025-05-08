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
  FaCamera, FaMapMarkerAlt, FaUserFriends, FaBookOpen
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
        setShowCommentInput(null);
    };

    const handleCommentSubmit = (recipeId) => {
        if (!newComment.trim()) return;
        
        // Here you would typically send the comment to your backend
        toast.success('Comment submitted! (Would be saved to database in production)');
        setNewComment('');
        setShowCommentInput(null);
    };

    const handleReviewSubmit = (recipeId) => {
        if (!newReview.text.trim() || newReview.rating === 0) {
            toast.error('Please add both a rating and review text');
            return;
        }
        
        // Here you would typically send the review to your backend
        toast.success(`Review submitted! Rating: ${newReview.rating}, Text: ${newReview.text}`);
        setNewReview({ rating: 0, text: '' });
        setShowReviewInput(null);
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
        <div className="bg-gray-50 min-h-screen">
            <Navbar />
            <ToastContainer />
            
            {/* Header Section */}
            <div className="bg-white shadow-sm">
                <div className="max-w-6xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-pink-500 bg-clip-text text-transparent">
                            Recipe Feed
                        </h1>
                        <div className="flex items-center space-x-4">
                            <button 
                                onClick={() => setShowFilters(!showFilters)}
                                className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center space-x-2"
                            >
                                <FaCamera />
                                <span>Filters</span>
                            </button>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search recipes..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Filter Section */}
                    {showFilters && (
                        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <h3 className="font-semibold mb-2">Recipe Type</h3>
                                    <div className="space-y-2">
                                        {['Vegetarian', 'Vegan', 'Meat', 'Dessert', 'Spicy'].map(type => (
                                            <label key={type} className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedFilters.type.includes(type)}
                                                    onChange={(e) => {
                                                        const newTypes = e.target.checked
                                                            ? [...selectedFilters.type, type]
                                                            : selectedFilters.type.filter(t => t !== type);
                                                        setSelectedFilters({...selectedFilters, type: newTypes});
                                                    }}
                                                    className="rounded text-blue-500"
                                                />
                                                <span>{type}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">Cooking Time</h3>
                                    <select
                                        value={selectedFilters.time || ''}
                                        onChange={(e) => setSelectedFilters({...selectedFilters, time: e.target.value ? parseInt(e.target.value) : null})}
                                        className="w-full p-2 border rounded-lg"
                                    >
                                        <option value="">Any time</option>
                                        <option value="30">Under 30 minutes</option>
                                        <option value="60">Under 1 hour</option>
                                        <option value="120">Under 2 hours</option>
                                    </select>
                                </div>
                                <div>
                                    <h3 className="font-semibold mb-2">Difficulty</h3>
                                    <select
                                        value={selectedFilters.difficulty || ''}
                                        onChange={(e) => setSelectedFilters({...selectedFilters, difficulty: e.target.value || null})}
                                        className="w-full p-2 border rounded-lg"
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

                    {/* Tabs */}
                    <div className="flex space-x-4 border-b">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`px-4 py-2 ${activeTab === 'all' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                        >
                            All Recipes
                        </button>
                        <button
                            onClick={() => setActiveTab('saved')}
                            className={`px-4 py-2 ${activeTab === 'saved' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                        >
                            Saved
                        </button>
                        <button
                            onClick={() => setActiveTab('liked')}
                            className={`px-4 py-2 ${activeTab === 'liked' ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
                        >
                            Liked
                        </button>
                    </div>
                </div>
            </div>

            {/* Recipe Feed */}
            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredRecipes.map(recipe => (
                        <div key={recipe.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                            {/* Post Header */}
                            <div className="p-4 border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                                            {recipe.authorImage ? (
                                                <img src={recipe.authorImage} alt={recipe.author} className="w-full h-full object-cover" />
                                            ) : (
                                                <FaUser className="text-gray-500" />
                                            )}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900">{recipe.author || 'Anonymous Chef'}</h3>
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
                                        className="p-2 hover:bg-gray-100 rounded-full"
                                    >
                                        <FaEllipsisH className="text-gray-500" />
                                    </button>
                                </div>
                            </div>

                            {/* Recipe Image */}
                            <div className="relative group">
                                <img
                                    src={getImageUrl(recipe.recipeImage)}
                                    alt={recipe.title}
                                    onError={handleImageError}
                                    className="w-full h-64 object-cover"
                                />
                                <div className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-md">
                                    {getTypeIcon(recipe.type)}
                                </div>
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="flex items-center space-x-4 text-white">
                                        <div className="flex items-center">
                                            <FaClock className="mr-1" />
                                            <span>{formatTime(recipe.time)}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <FaUtensils className="mr-1" />
                                            <span>{recipe.servings || 'N/A'} servings</span>
                                        </div>
                                        <div className="flex items-center">
                                            <FaBookOpen className="mr-1" />
                                            <span>{recipe.difficulty || 'Medium'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Recipe Content */}
                            <div className="p-4">
                                <h2 className="text-xl font-bold mb-2">{recipe.title}</h2>
                                <p className="text-gray-600 mb-4 line-clamp-2">{recipe.description}</p>
                                
                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {recipe.tags?.map(tag => (
                                        <span key={tag} className="px-2 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Engagement Bar */}
                                <div className="flex items-center justify-between border-t border-b border-gray-100 py-3">
                                    <button 
                                        onClick={() => toggleLike(recipe.id)}
                                        className="flex items-center space-x-2 text-gray-500 hover:text-red-500 transition-colors"
                                    >
                                        {likedRecipes.includes(recipe.id) ? 
                                            <FaHeart className="text-red-500" /> : 
                                            <FaRegHeart />
                                        }
                                        <span>{recipe.likes || 0}</span>
                                    </button>
                                    <button 
                                        onClick={() => toggleCommentInput(recipe.id)}
                                        className="flex items-center space-x-2 text-gray-500 hover:text-blue-500 transition-colors"
                                    >
                                        <FaComment />
                                        <span>{recipe.comments?.length || 0}</span>
                                    </button>
                                    <button 
                                        onClick={() => shareRecipe(recipe)}
                                        className="flex items-center space-x-2 text-gray-500 hover:text-green-500 transition-colors"
                                    >
                                        <FaShareAlt />
                                        <span>Share</span>
                                    </button>
                                    <button 
                                        onClick={() => toggleSave(recipe.id)}
                                        className="flex items-center space-x-2 text-gray-500 hover:text-yellow-500 transition-colors"
                                    >
                                        {savedRecipes.includes(recipe.id) ? 
                                            <FaBookmark className="text-yellow-500" /> : 
                                            <FaRegBookmark />
                                        }
                                        <span>Save</span>
                                    </button>
                                </div>

                                {/* Comments Section */}
                                {showCommentInput === recipe.id && (
                                    <div className="mt-4">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                                <FaUser className="text-gray-500" />
                                            </div>
                                            <textarea
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                                placeholder="Write a comment..."
                                                className="flex-1 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                rows="2"
                                            />
                                        </div>
                                        <div className="flex justify-end">
                                            <button
                                                onClick={() => handleCommentSubmit(recipe.id)}
                                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                            >
                                                Post Comment
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* Recipe Actions */}
                                {showMenu === recipe.id && (
                                    <div className="absolute right-4 top-12 bg-white rounded-lg shadow-lg border border-gray-100 z-50">
                                        <button
                                            onClick={() => handleEdit(recipe.id)}
                                            className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 w-full"
                                        >
                                            <FaEdit className="text-blue-500" />
                                            <span>Edit Recipe</span>
                                        </button>
                                        <button
                                            onClick={() => handleDelete(recipe.id)}
                                            className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 w-full text-red-500"
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