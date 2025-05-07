import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { 
  FaHeart, FaRegHeart, FaShareAlt, FaClock, 
  FaUtensils, FaEllipsisH, FaRegBookmark, 
  FaBookmark, FaFireAlt, FaLeaf, FaBreadSlice,
  FaEdit, FaTrash, FaComment, FaUser,
  FaStar, FaRegStar
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
                const response = await axios.delete(`http://localhost:8080/api/recipes/${recipeId}`);
                
                if (response.status === 200) {
                    setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe._id !== recipeId));
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
        <div>
            <Navbar />
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '20px',
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                backgroundColor: '#f9f9f9',
                minHeight: '100vh'
            }}>
                <div style={{
                    textAlign: 'center',
                    margin: '30px 0',
                    position: 'relative'
                }}>
                    <h1 style={{
                        color: '#333',
                        fontSize: '2.5rem',
                        fontWeight: '700',
                        marginBottom: '10px',
                        background: 'linear-gradient(45deg, #3a86ff, #ff6b6b)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        display: 'inline-block'
                    }}>
                        Recipe Collection
                    </h1>
                </div>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '20px',
                    padding: '20px 0'
                }}>
                    {recipes.map(recipe => (
                        <div key={recipe._id} style={{
                            background: 'white',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                            transition: 'transform 0.2s',
                            cursor: 'pointer',
                            position: 'relative'
                        }}>
                            <img
                                src={getImageUrl(recipe.recipeImage)}
                                alt={recipe.title}
                                onError={handleImageError}
                                style={{
                                    width: '100%',
                                    height: '200px',
                                    objectFit: 'cover'
                                }}
                            />
                            <div style={{
                                padding: '15px',
                                position: 'relative'
                            }}>
                                <h3 style={{
                                    margin: '0 0 10px 0',
                                    fontSize: '1.2rem',
                                    color: '#333'
                                }}>
                                    {recipe.title}
                                </h3>
                                <p style={{
                                    color: '#666',
                                    fontSize: '0.9rem',
                                    marginBottom: '15px'
                                }}>
                                    {recipe.description}
                                </p>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginTop: '10px'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px'
                                    }}>
                                        <FaClock style={{ color: '#666' }} />
                                        <span style={{ fontSize: '0.9rem', color: '#666' }}>
                                            {formatTime(recipe.time)}
                                        </span>
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px'
                                    }}>
                                        {getTypeIcon(recipe.type)}
                                        <span style={{ fontSize: '0.9rem', color: '#666' }}>
                                            {recipe.type}
                                        </span>
                                    </div>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginTop: '15px'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        gap: '10px'
                                    }}>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleLike(recipe._id);
                                            }}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                color: likedRecipes.includes(recipe._id) ? '#ff6b6b' : '#666'
                                            }}
                                        >
                                            {likedRecipes.includes(recipe._id) ? <FaHeart /> : <FaRegHeart />}
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                toggleSave(recipe._id);
                                            }}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                color: savedRecipes.includes(recipe._id) ? '#4CAF50' : '#666'
                                            }}
                                        >
                                            {savedRecipes.includes(recipe._id) ? <FaBookmark /> : <FaRegBookmark />}
                                        </button>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                shareRecipe(recipe);
                                            }}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                color: '#666'
                                            }}
                                        >
                                            <FaShareAlt />
                                        </button>
                                    </div>
                                    <div style={{ position: 'relative' }}>
                                        <button
                                            onClick={(e) => toggleMenu(recipe._id, e)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                color: '#666'
                                            }}
                                        >
                                            <FaEllipsisH />
                                        </button>
                                        {showMenu === recipe._id && (
                                            <div style={{
                                                position: 'absolute',
                                                right: '0',
                                                top: '100%',
                                                background: 'white',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                borderRadius: '4px',
                                                zIndex: 1000
                                            }}>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleEdit(recipe._id);
                                                    }}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '5px',
                                                        padding: '8px 12px',
                                                        width: '100%',
                                                        border: 'none',
                                                        background: 'none',
                                                        cursor: 'pointer',
                                                        color: '#333'
                                                    }}
                                                >
                                                    <FaEdit /> Edit
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(recipe._id);
                                                    }}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '5px',
                                                        padding: '8px 12px',
                                                        width: '100%',
                                                        border: 'none',
                                                        background: 'none',
                                                        cursor: 'pointer',
                                                        color: '#ff4444'
                                                    }}
                                                >
                                                    <FaTrash /> Delete
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default DisplayRecipe;