import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { 
  FaHeart, FaRegHeart, FaShareAlt, FaClock, 
  FaUtensils, FaEllipsisH, FaRegBookmark, 
  FaBookmark, FaFireAlt, FaLeaf, FaBreadSlice 
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
    const { id } = useParams();

    useEffect(() => {
        loadRecipes();
        // Load saved recipes from localStorage if available
        const saved = JSON.parse(localStorage.getItem('savedRecipes')) || [];
        const liked = JSON.parse(localStorage.getItem('likedRecipes')) || [];
        setSavedRecipes(saved);
        setLikedRecipes(liked);
    }, []);

    const loadRecipes = async () => {
        try {
            const result = await axios.get(`http://localhost:8080/recipes`);
            setRecipes(result.data);
            setLoading(false);
        } catch (error) {
            console.error("Error loading recipes:", error);
            toast.error('Failed to load recipes');
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

    const formatTime = (minutes) => {
        if (!minutes) return "Not specified";
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours > 0 ? `${hours}h ` : ''}${mins > 0 ? `${mins}m` : ''}`;
    };

    const getTypeIcon = (type) => {
        switch(type.toLowerCase()) {
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
                // Fallback for browsers that don't support Web Share API
                await navigator.clipboard.writeText(window.location.href);
                toast.info('Link copied to clipboard!');
            }
        } catch (error) {
            console.error('Error sharing:', error);
            toast.error('Failed to share recipe');
        }
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
            }}>
                <div style={{
                    textAlign: 'center',
                    padding: '40px',
                    borderRadius: '12px',
                    background: '#fff',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                }}>
                    <h2 style={{ color: '#333', marginBottom: '20px' }}>Loading delicious recipes...</h2>
                    <div style={{ 
                        width: '50px', 
                        height: '50px', 
                        border: '5px solid #f3f3f3',
                        borderTop: '5px solid #3a86ff',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto'
                    }}></div>
                </div>
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
            
            <ToastContainer position="top-right" autoClose={3000} />
            
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
                }}>Delicious Recipes</h1>
                <p style={{
                    color: '#666',
                    fontSize: '1.1rem',
                    maxWidth: '700px',
                    margin: '0 auto'
                }}>Discover amazing recipes shared by our community of food lovers</p>
            </div>
            
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                gap: '30px',
                marginTop: '20px'
            }}>
                {recipes.map((recipe) => (
                    <div key={recipe.id} style={{
                        background: '#fff',
                        borderRadius: '16px',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        position: 'relative',
                        ':hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: '0 12px 30px rgba(0,0,0,0.15)'
                        }
                    }}>
                        {/* Recipe Type Badge */}
                        <div style={{
                            position: 'absolute',
                            top: '15px',
                            right: '15px',
                            background: 'rgba(255,255,255,0.9)',
                            padding: '5px 12px',
                            borderRadius: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            zIndex: '1',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                        }}>
                            {getTypeIcon(recipe.type)}
                            <span style={{
                                color: '#333',
                                fontSize: '0.8rem',
                                fontWeight: '600',
                                textTransform: 'capitalize'
                            }}>{recipe.type}</span>
                        </div>
                        
                        {/* Recipe Image */}
                        <div style={{
                            width: '100%',
                            height: '250px',
                            overflow: 'hidden',
                            position: 'relative'
                        }}>
                            <img 
                                src={`http://localhost:8080/uploads/${recipe.recipeImage}`}
                                alt={recipe.title}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    transition: 'transform 0.5s ease'
                                }}
                                onError={(e) => {
                                    e.target.src = 'https://via.placeholder.com/400x250?text=Recipe+Image';
                                }}
                            />
                            <div style={{
                                position: 'absolute',
                                bottom: '0',
                                left: '0',
                                right: '0',
                                height: '60px',
                                background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)'
                            }}></div>
                        </div>
                        
                        {/* Recipe Header */}
                        <div style={{
                            padding: '20px 20px 15px',
                            position: 'relative'
                        }}>
                            <h2 style={{
                                margin: '0 0 10px',
                                fontSize: '1.5rem',
                                fontWeight: '600',
                                color: '#333',
                                lineHeight: '1.3'
                            }}>{recipe.title}</h2>
                            
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '15px',
                                marginBottom: '15px'
                            }}>
                                <span style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    color: '#666',
                                    fontSize: '0.9rem'
                                }}>
                                    <FaClock style={{ color: '#3a86ff' }} />
                                    {formatTime(recipe.time)}
                                </span>
                                
                                <span style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    color: '#666',
                                    fontSize: '0.9rem'
                                }}>
                                    {likedRecipes.includes(recipe.id) ? 
                                        <FaHeart style={{ color: '#ff6b6b' }} /> : 
                                        <FaRegHeart style={{ color: '#666' }} />}
                                    {Math.floor(Math.random() * 100) + 1} likes
                                </span>
                            </div>
                        </div>
                        
                        {/* Recipe Actions */}
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '0 20px 15px',
                            borderBottom: '1px solid #eee'
                        }}>
                            <button 
                                onClick={() => toggleLike(recipe.id)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    color: likedRecipes.includes(recipe.id) ? '#ff6b6b' : '#666',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    transition: 'all 0.2s ease',
                                    ':hover': {
                                        transform: 'scale(1.1)'
                                    }
                                }}
                            >
                                {likedRecipes.includes(recipe.id) ? <FaHeart /> : <FaRegHeart />}
                                <span>Like</span>
                            </button>
                            
                            <button 
                                onClick={() => shareRecipe(recipe)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    color: '#666',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    transition: 'all 0.2s ease',
                                    ':hover': {
                                        transform: 'scale(1.1)',
                                        color: '#3a86ff'
                                    }
                                }}
                            >
                                <FaShareAlt />
                                <span>Share</span>
                            </button>
                            
                            <button 
                                onClick={() => toggleSave(recipe.id)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    color: savedRecipes.includes(recipe.id) ? '#3a86ff' : '#666',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    transition: 'all 0.2s ease',
                                    ':hover': {
                                        transform: 'scale(1.1)'
                                    }
                                }}
                            >
                                {savedRecipes.includes(recipe.id) ? <FaBookmark /> : <FaRegBookmark />}
                                <span>Save</span>
                            </button>
                        </div>
                        
                        {/* Recipe Preview */}
                        <div style={{ padding: '0 20px' }}>
                            <p style={{
                                color: '#555',
                                fontSize: '0.95rem',
                                lineHeight: '1.6',
                                margin: '15px 0',
                                display: '-webkit-box',
                                WebkitLineClamp: '3',
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis'
                            }}>{recipe.description}</p>
                            
                            <button 
                                onClick={() => toggleExpand(recipe.id)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#3a86ff',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    padding: '5px 0 15px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    fontSize: '0.95rem',
                                    transition: 'all 0.2s ease',
                                    ':hover': {
                                        color: '#2a6fd6'
                                    }
                                }}
                            >
                                <FaEllipsisH />
                                {expandedRecipe === recipe.id ? 'Show less' : 'Show more'}
                            </button>
                        </div>
                        
                        {/* Expanded Recipe Details */}
                        {expandedRecipe === recipe.id && (
                            <div style={{
                                padding: '0 20px 20px',
                                borderTop: '1px solid #eee',
                                animation: 'fadeIn 0.3s ease'
                            }}>
                                <div style={{ marginBottom: '20px' }}>
                                    <h3 style={{
                                        fontSize: '1.2rem',
                                        margin: '15px 0 10px',
                                        color: '#333',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        paddingBottom: '5px',
                                        borderBottom: '2px solid #f0f0f0'
                                    }}>
                                        <FaUtensils style={{ color: '#3a86ff' }} />
                                        Ingredients
                                    </h3>
                                    <ul style={{
                                        margin: '0',
                                        paddingLeft: '20px',
                                        color: '#555',
                                        lineHeight: '1.8'
                                    }}>
                                        {recipe.ingredients.split('\n').filter(i => i.trim()).map((item, i) => (
                                            <li key={i} style={{ 
                                                marginBottom: '5px',
                                                position: 'relative',
                                                paddingLeft: '20px'
                                            }}>
                                                <span style={{
                                                    position: 'absolute',
                                                    left: '0',
                                                    color: '#3a86ff'
                                                }}>•</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                
                                <div>
                                    <h3 style={{
                                        fontSize: '1.2rem',
                                        margin: '15px 0 10px',
                                        color: '#333',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        paddingBottom: '5px',
                                        borderBottom: '2px solid #f0f0f0'
                                    }}>
                                        <FaUtensils style={{ color: '#3a86ff' }} />
                                        Steps
                                    </h3>
                                    <ol style={{
                                        margin: '0',
                                        paddingLeft: '20px',
                                        color: '#555',
                                        lineHeight: '1.8'
                                    }}>
                                        {recipe.steps.split('\n').filter(s => s.trim()).map((step, i) => (
                                            <li key={i} style={{ 
                                                marginBottom: '10px',
                                                position: 'relative',
                                                paddingLeft: '25px'
                                            }}>
                                                <span style={{
                                                    position: 'absolute',
                                                    left: '0',
                                                    background: '#3a86ff',
                                                    color: 'white',
                                                    borderRadius: '50%',
                                                    width: '20px',
                                                    height: '20px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '0.7rem',
                                                    fontWeight: 'bold'
                                                }}>{i + 1}</span>
                                                {step}
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
        </div>
    );
}

export default DisplayRecipe;