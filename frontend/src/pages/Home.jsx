import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaFilter, FaClock, FaUser, FaHeart, FaRegHeart, FaUtensils, FaStar, FaFire, FaLeaf, FaDrumstickBite, FaChevronRight } from 'react-icons/fa';
import { toast } from 'react-toastify';

// Real food images for hero section
const heroImages = [
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    'https://images.unsplash.com/photo-1495521821757-a1efb6729352?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
    'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80'
];

// Category images
const categoryImages = {
    breakfast: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    lunch: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    dinner: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    dessert: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    snack: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'
};

function Home() {
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        category: 'all',
        cookingTime: 'all',
        type: 'all'
    });
    const [showFilters, setShowFilters] = useState(false);
    const [favorites, setFavorites] = useState([]);
    const [featuredRecipes, setFeaturedRecipes] = useState([]);
    const [currentHeroImage, setCurrentHeroImage] = useState(0);

    useEffect(() => {
        loadRecipes();
        const savedFavorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        setFavorites(savedFavorites);

        // Rotate hero images
        const interval = setInterval(() => {
            setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const loadRecipes = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/recipes');
            setRecipes(response.data);
            const randomRecipes = [...response.data]
                .sort(() => 0.5 - Math.random())
                .slice(0, 3);
            setFeaturedRecipes(randomRecipes);
        } catch (error) {
            console.error('Error loading recipes:', error);
            toast.error('Failed to load recipes');
        } finally {
            setLoading(false);
        }
    };

    const toggleFavorite = (recipeId) => {
        const newFavorites = favorites.includes(recipeId)
            ? favorites.filter(id => id !== recipeId)
            : [...favorites, recipeId];
        setFavorites(newFavorites);
        localStorage.setItem('favorites', JSON.stringify(newFavorites));
        toast.success(favorites.includes(recipeId) ? 'Removed from favorites' : 'Added to favorites');
    };

    const filteredRecipes = recipes.filter(recipe => {
        const matchesSearch = recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            recipe.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filters.category === 'all' || recipe.category === filters.category;
        const matchesType = filters.type === 'all' || recipe.type === filters.type;
        const matchesTime = filters.cookingTime === 'all' || 
            (filters.cookingTime === 'quick' && recipe.cookingTime <= 30) ||
            (filters.cookingTime === 'medium' && recipe.cookingTime > 30 && recipe.cookingTime <= 60) ||
            (filters.cookingTime === 'long' && recipe.cookingTime > 60);

        return matchesSearch && matchesCategory && matchesType && matchesTime;
    });

    const categories = ['all', 'breakfast', 'lunch', 'dinner', 'dessert', 'snack'];
    const cookingTimes = ['all', 'quick', 'medium', 'long'];
    const types = ['all', 'vegetarian', 'vegan', 'gluten-free', 'non-vegetarian'];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration: 0.5
            }
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#f8f9fa',
            padding: '20px'
        }}>
            {/* Hero Section with Image Slider */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                style={{
                    position: 'relative',
                    height: '600px',
                    borderRadius: '24px',
                    marginBottom: '60px',
                    overflow: 'hidden'
                }}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentHeroImage}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1 }}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${heroImages[currentHeroImage]})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundAttachment: 'fixed'
                        }}
                    />
                </AnimatePresence>

                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.8 }}
                    style={{
                        position: 'relative',
                        zIndex: 2,
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: 'white',
                        textAlign: 'center',
                        padding: '0 20px'
                    }}
                >
                    <h1 style={{
                        fontSize: '4.5rem',
                        marginBottom: '20px',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                        fontWeight: '800',
                        background: 'linear-gradient(45deg, #FF6B6B, #FFE66D)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Culinary Adventures Await
                    </h1>
                    <p style={{
                        fontSize: '1.6rem',
                        maxWidth: '800px',
                        marginBottom: '40px',
                        lineHeight: '1.6',
                        textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                    }}>
                        Discover, create, and share your culinary masterpieces with our vibrant community of food enthusiasts
                    </p>
                    <div style={{
                        display: 'flex',
                        gap: '20px',
                        justifyContent: 'center'
                    }}>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link to="/recipe/add" style={{
                                backgroundColor: '#FF6B6B',
                                color: 'white',
                                padding: '15px 30px',
                                borderRadius: '30px',
                                textDecoration: 'none',
                                fontWeight: '600',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)',
                                fontSize: '1.1rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                Share Your Recipe <FaChevronRight />
                            </Link>
                        </motion.div>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link to="/displayrecipe" style={{
                                backgroundColor: 'transparent',
                                color: 'white',
                                padding: '15px 30px',
                                borderRadius: '30px',
                                textDecoration: 'none',
                                fontWeight: '600',
                                transition: 'all 0.3s ease',
                                border: '2px solid white',
                                fontSize: '1.1rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                Explore Recipes <FaChevronRight />
                            </Link>
                        </motion.div>
                    </div>
                </motion.div>

                {/* Hero Image Navigation Dots */}
                <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '10px',
                    zIndex: 2
                }}>
                    {heroImages.map((_, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.2 }}
                            onClick={() => setCurrentHeroImage(index)}
                            style={{
                                width: '12px',
                                height: '12px',
                                borderRadius: '50%',
                                backgroundColor: currentHeroImage === index ? '#FF6B6B' : 'rgba(255,255,255,0.5)',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                        />
                    ))}
                </div>
            </motion.div>

            {/* Categories Section */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                style={{
                    maxWidth: '1200px',
                    margin: '0 auto 60px'
                }}
            >
                <h2 style={{
                    fontSize: '2.5rem',
                    textAlign: 'center',
                    marginBottom: '40px',
                    color: '#2c3e50',
                    fontWeight: '700'
                }}>
                    Browse by Category
                </h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '30px'
                }}>
                    {Object.entries(categoryImages).map(([category, image], index) => (
                        <motion.div
                            key={category}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                            style={{
                                position: 'relative',
                                height: '200px',
                                borderRadius: '20px',
                                overflow: 'hidden',
                                cursor: 'pointer'
                            }}
                            onClick={() => setFilters({ ...filters, category })}
                        >
                            <img
                                src={image}
                                alt={category}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    transition: 'transform 0.3s ease'
                                }}
                            />
                            <div style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                background: 'linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7))',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white',
                                fontSize: '1.5rem',
                                fontWeight: '600',
                                textTransform: 'capitalize'
                            }}>
                                {category}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Featured Recipes Section */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                style={{
                    maxWidth: '1200px',
                    margin: '0 auto 60px'
                }}
            >
                <h2 style={{
                    fontSize: '2.5rem',
                    textAlign: 'center',
                    marginBottom: '40px',
                    color: '#2c3e50',
                    fontWeight: '700'
                }}>
                    Featured Recipes
                </h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
                    gap: '30px'
                }}>
                    {featuredRecipes.map((recipe, index) => (
                        <motion.div
                            key={recipe.id}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 * index, duration: 0.5 }}
                            style={{
                                backgroundColor: 'white',
                                borderRadius: '20px',
                                overflow: 'hidden',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                transition: 'transform 0.3s ease'
                            }}
                            whileHover={{ y: -10 }}
                        >
                            <div style={{
                                position: 'relative',
                                height: '250px',
                                overflow: 'hidden'
                            }}>
                                <img
                                    src={recipe.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'}
                                    alt={recipe.title}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        transition: 'transform 0.3s ease'
                                    }}
                                />
                                <div style={{
                                    position: 'absolute',
                                    top: '20px',
                                    left: '20px',
                                    backgroundColor: 'rgba(255,255,255,0.9)',
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '5px',
                                    fontWeight: '600',
                                    color: '#FF6B6B'
                                }}>
                                    <FaStar /> Featured
                                </div>
                            </div>
                            <div style={{ padding: '25px' }}>
                                <h3 style={{
                                    fontSize: '1.5rem',
                                    marginBottom: '15px',
                                    color: '#2c3e50'
                                }}>
                                    {recipe.title}
                                </h3>
                                <p style={{
                                    color: '#666',
                                    marginBottom: '20px',
                                    lineHeight: '1.6'
                                }}>
                                    {recipe.description}
                                </p>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '20px'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        color: '#666'
                                    }}>
                                        <FaClock /> {recipe.cookingTime} mins
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        color: '#666'
                                    }}>
                                        {recipe.type === 'vegetarian' && <FaLeaf style={{ color: '#4CAF50' }} />}
                                        {recipe.type === 'non-vegetarian' && <FaDrumstickBite style={{ color: '#FF6B6B' }} />}
                                        {recipe.type}
                                    </div>
                                </div>
                                <Link
                                    to={`/recipe/${recipe.id}`}
                                    style={{
                                        display: 'block',
                                        textAlign: 'center',
                                        backgroundColor: '#FF6B6B',
                                        color: 'white',
                                        padding: '12px',
                                        borderRadius: '30px',
                                        textDecoration: 'none',
                                        fontWeight: '600',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    View Recipe
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Search and Filter Section */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                style={{
                    maxWidth: '1200px',
                    margin: '0 auto 60px',
                    backgroundColor: 'white',
                    padding: '30px',
                    borderRadius: '20px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                }}
            >
                <div style={{
                    display: 'flex',
                    gap: '20px',
                    marginBottom: '20px',
                    flexWrap: 'wrap'
                }}>
                    <div style={{
                        flex: 1,
                        minWidth: '300px',
                        position: 'relative'
                    }}>
                        <input
                            type="text"
                            placeholder="Search recipes..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '15px 50px 15px 20px',
                                borderRadius: '30px',
                                border: '2px solid #eee',
                                fontSize: '1.1rem',
                                transition: 'all 0.3s ease'
                            }}
                        />
                        <FaSearch style={{
                            position: 'absolute',
                            right: '20px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#666',
                            fontSize: '1.2rem'
                        }} />
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowFilters(!showFilters)}
                        style={{
                            padding: '15px 30px',
                            backgroundColor: '#fff',
                            border: '2px solid #eee',
                            borderRadius: '30px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            fontSize: '1.1rem'
                        }}
                    >
                        <FaFilter /> Filters
                    </motion.button>
                </div>

                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            style={{
                                overflow: 'hidden',
                                backgroundColor: '#f8f9fa',
                                borderRadius: '15px',
                                padding: '20px',
                                marginTop: '20px'
                            }}
                        >
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                gap: '30px'
                            }}>
                                {[
                                    { label: 'Category', value: filters.category, options: categories },
                                    { label: 'Cooking Time', value: filters.cookingTime, options: cookingTimes },
                                    { label: 'Type', value: filters.type, options: types }
                                ].map((filter, index) => (
                                    <motion.div
                                        key={filter.label}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                    >
                                        <label style={{
                                            display: 'block',
                                            marginBottom: '10px',
                                            fontWeight: '600',
                                            color: '#2c3e50',
                                            fontSize: '1.1rem'
                                        }}>
                                            {filter.label}
                                        </label>
                                        <select
                                            value={filter.value}
                                            onChange={(e) => setFilters({ ...filters, [filter.label.toLowerCase().replace(' ', '')]: e.target.value })}
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                borderRadius: '15px',
                                                border: '2px solid #eee',
                                                fontSize: '1rem',
                                                backgroundColor: 'white',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {filter.options.map(option => (
                                                <option key={option} value={option}>
                                                    {option.split('-').map(word => 
                                                        word.charAt(0).toUpperCase() + word.slice(1)
                                                    ).join(' ')}
                                                </option>
                                            ))}
                                        </select>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Recipes Grid */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}
            >
                {loading ? (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        minHeight: '300px'
                    }}>
                        <motion.div
                            animate={{
                                rotate: 360,
                                scale: [1, 1.2, 1]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                            style={{
                                width: '50px',
                                height: '50px',
                                border: '4px solid #f3f3f3',
                                borderTop: '4px solid #FF6B6B',
                                borderRadius: '50%'
                            }}
                        />
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                        gap: '30px'
                    }}>
                        {filteredRecipes.map((recipe, index) => (
                            <motion.div
                                key={recipe.id}
                                variants={itemVariants}
                                style={{
                                    backgroundColor: 'white',
                                    borderRadius: '20px',
                                    overflow: 'hidden',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                                    transition: 'transform 0.3s ease'
                                }}
                                whileHover={{ y: -10 }}
                            >
                                <div style={{
                                    position: 'relative',
                                    height: '200px',
                                    overflow: 'hidden'
                                }}>
                                    <img
                                        src={recipe.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'}
                                        alt={recipe.title}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            transition: 'transform 0.3s ease'
                                        }}
                                    />
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => toggleFavorite(recipe.id)}
                                        style={{
                                            position: 'absolute',
                                            top: '15px',
                                            right: '15px',
                                            backgroundColor: 'rgba(255,255,255,0.9)',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '40px',
                                            height: '40px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                                        }}
                                    >
                                        {favorites.includes(recipe.id) ? (
                                            <FaHeart style={{ color: '#FF6B6B', fontSize: '1.2rem' }} />
                                        ) : (
                                            <FaRegHeart style={{ color: '#666', fontSize: '1.2rem' }} />
                                        )}
                                    </motion.button>
                                </div>
                                <div style={{ padding: '25px' }}>
                                    <h3 style={{
                                        margin: '0 0 15px 0',
                                        fontSize: '1.3rem',
                                        color: '#2c3e50',
                                        fontWeight: '600'
                                    }}>
                                        {recipe.title}
                                    </h3>
                                    <p style={{
                                        color: '#666',
                                        marginBottom: '20px',
                                        fontSize: '1rem',
                                        lineHeight: '1.6',
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                    }}>
                                        {recipe.description}
                                    </p>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        marginBottom: '20px'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            color: '#666',
                                            fontSize: '1rem'
                                        }}>
                                            <FaClock /> {recipe.cookingTime} mins
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '8px',
                                            color: '#666',
                                            fontSize: '1rem'
                                        }}>
                                            {recipe.type === 'vegetarian' && <FaLeaf style={{ color: '#4CAF50' }} />}
                                            {recipe.type === 'non-vegetarian' && <FaDrumstickBite style={{ color: '#FF6B6B' }} />}
                                            {recipe.type}
                                        </div>
                                    </div>
                                    <motion.div
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Link
                                            to={`/recipe/${recipe.id}`}
                                            style={{
                                                display: 'block',
                                                textAlign: 'center',
                                                backgroundColor: '#FF6B6B',
                                                color: 'white',
                                                padding: '12px',
                                                borderRadius: '30px',
                                                textDecoration: 'none',
                                                fontWeight: '600',
                                                transition: 'all 0.3s ease',
                                                fontSize: '1.1rem'
                                            }}
                                        >
                                            View Recipe
                                        </Link>
                                    </motion.div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* No Results Message */}
                {!loading && filteredRecipes.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            textAlign: 'center',
                            padding: '60px',
                            color: '#666',
                            backgroundColor: 'white',
                            borderRadius: '20px',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                        }}
                    >
                        <h3 style={{
                            fontSize: '1.8rem',
                            marginBottom: '15px',
                            color: '#2c3e50'
                        }}>
                            No recipes found
                        </h3>
                        <p style={{
                            fontSize: '1.1rem',
                            color: '#666'
                        }}>
                            Try adjusting your search or filters to find what you're looking for
                        </p>
                    </motion.div>
                )}
            </motion.div>
        </div>
    );
}

export default Home;