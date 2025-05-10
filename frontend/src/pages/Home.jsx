import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaSearch, FaFilter, FaClock, FaUser, FaHeart, FaRegHeart, FaUtensils, FaStar, FaFire, FaLeaf, FaDrumstickBite, FaChevronRight, FaArrowRight, FaPlay, FaPause } from 'react-icons/fa';
import { toast } from 'react-toastify';

// Real food images for hero section with descriptions
const heroImages = [
    {
        url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
        title: 'Discover Culinary Delights',
        description: 'Explore a world of flavors and create unforgettable dining experiences'
    },
    {
        url: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
        title: 'Share Your Passion',
        description: 'Join our community of food enthusiasts and share your culinary creations'
    },
    {
        url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
        title: 'Healthy & Delicious',
        description: 'Find nutritious recipes that don\'t compromise on taste'
    }
];

// Category images with descriptions and features
const categories = [
    {
        name: 'breakfast',
        image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        description: 'Start your day with delicious breakfast recipes',
        color: '#FFB74D',
        features: ['Quick & Easy', 'Healthy Options', 'Family Favorites']
    },
    {
        name: 'lunch',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        description: 'Quick and healthy lunch ideas',
        color: '#4CAF50',
        features: ['30-Minute Meals', 'Meal Prep', 'Office-Friendly']
    },
    {
        name: 'dinner',
        image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        description: 'Gourmet dinner recipes for special occasions',
        color: '#E91E63',
        features: ['Date Night', 'Family Dinners', 'Entertaining']
    },
    {
        name: 'dessert',
        image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        description: 'Sweet treats and decadent desserts',
        color: '#9C27B0',
        features: ['Quick Treats', 'Baking', 'No-Bake Options']
    },
    {
        name: 'snack',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        description: 'Quick and easy snack recipes',
        color: '#FF9800',
        features: ['Healthy Snacks', 'Party Food', 'On-the-Go']
    }
];

function Home() {
    const [currentHeroImage, setCurrentHeroImage] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [hoveredCategory, setHoveredCategory] = useState(null);

    useEffect(() => {
        let interval;
        if (!isPaused) {
            interval = setInterval(() => {
                setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
            }, 5000);
        }
        return () => clearInterval(interval);
    }, [isPaused]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            window.location.href = `/displayrecipe?search=${encodeURIComponent(searchTerm)}`;
        }
    };

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
            backgroundColor: '#f8f9fa'
        }}>
            {/* Hero Section with Parallax Effect */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                style={{
                    position: 'relative',
                    height: '100vh',
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
                            background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${heroImages[currentHeroImage].url})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundAttachment: 'fixed'
                        }}
                    />
                </AnimatePresence>

                {/* Hero Content */}
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
                    <motion.h1
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        style={{
                            fontSize: '5.5rem',
                            marginBottom: '20px',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                            fontWeight: '800',
                            background: 'linear-gradient(45deg, #FF6B6B, #FFE66D)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}
                    >
                        {heroImages[currentHeroImage].title}
                    </motion.h1>
                    <motion.p
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        style={{
                            fontSize: '1.8rem',
                            maxWidth: '800px',
                            marginBottom: '40px',
                            lineHeight: '1.6',
                            textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                        }}
                    >
                        {heroImages[currentHeroImage].description}
                    </motion.p>

                    {/* Search Bar */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        style={{
                            width: '100%',
                            maxWidth: '600px',
                            marginBottom: '40px'
                        }}
                    >
                        <form onSubmit={handleSearch} style={{
                            display: 'flex',
                            gap: '10px',
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            padding: '10px',
                            borderRadius: '50px',
                            backdropFilter: 'blur(10px)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                        }}>
                            <input
                                type="text"
                                placeholder="Search for recipes..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                style={{
                                    flex: 1,
                                    padding: '15px 25px',
                                    borderRadius: '25px',
                                    border: 'none',
                                    fontSize: '1.1rem',
                                    backgroundColor: 'rgba(255,255,255,0.9)',
                                    outline: 'none',
                                    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                                }}
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                type="submit"
                                style={{
                                    padding: '15px 30px',
                                    borderRadius: '25px',
                                    border: 'none',
                                    backgroundColor: '#FF6B6B',
                                    color: 'white',
                                    fontSize: '1.1rem',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)'
                                }}
                            >
                                Search <FaSearch />
                            </motion.button>
                        </form>
                    </motion.div>

                    <div style={{
                        display: 'flex',
                        gap: '20px',
                        justifyContent: 'center'
                    }}>
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link to="/recipeadd" style={{
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

                {/* Hero Image Navigation */}
                <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    gap: '10px',
                    zIndex: 2,
                    alignItems: 'center'
                }}>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsPaused(!isPaused)}
                        style={{
                            backgroundColor: 'rgba(255,255,255,0.2)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '40px',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: 'white'
                        }}
                    >
                        {isPaused ? <FaPlay /> : <FaPause />}
                    </motion.button>
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
                    margin: '0 auto',
                    padding: '60px 20px'
                }}
            >
                <h2 style={{
                    fontSize: '3rem',
                    textAlign: 'center',
                    marginBottom: '60px',
                    color: '#2c3e50',
                    fontWeight: '700'
                }}>
                    Browse by Category
                </h2>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '30px'
                }}>
                    {categories.map((category, index) => (
                        <motion.div
                            key={category.name}
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ y: -10 }}
                            onHoverStart={() => setHoveredCategory(category.name)}
                            onHoverEnd={() => setHoveredCategory(null)}
                            style={{
                                position: 'relative',
                                height: '400px',
                                borderRadius: '20px',
                                overflow: 'hidden',
                                cursor: 'pointer',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                            }}
                            onClick={() => window.location.href = `/displayrecipe?category=${category.name}`}
                        >
                            <img
                                src={category.image}
                                alt={category.name}
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
                                background: `linear-gradient(rgba(0,0,0,0.3), ${category.color}99)`,
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                padding: '30px',
                                color: 'white',
                                textAlign: 'center'
                            }}>
                                <h3 style={{
                                    fontSize: '2rem',
                                    marginBottom: '15px',
                                    textTransform: 'capitalize',
                                    fontWeight: '700'
                                }}>
                                    {category.name}
                                </h3>
                                <p style={{
                                    fontSize: '1.1rem',
                                    marginBottom: '20px',
                                    lineHeight: '1.6'
                                }}>
                                    {category.description}
                                </p>
                                <AnimatePresence>
                                    {hoveredCategory === category.name && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: 20 }}
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: '10px',
                                                marginBottom: '20px'
                                            }}
                                        >
                                            {category.features.map((feature, idx) => (
                                                <motion.div
                                                    key={feature}
                                                    initial={{ opacity: 0, x: -20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    transition={{ delay: idx * 0.1 }}
                                                    style={{
                                                        backgroundColor: 'rgba(255,255,255,0.2)',
                                                        padding: '8px 16px',
                                                        borderRadius: '20px',
                                                        fontSize: '0.9rem'
                                                    }}
                                                >
                                                    {feature}
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                <motion.div
                                    whileHover={{ x: 5 }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        fontSize: '1.1rem',
                                        fontWeight: '600'
                                    }}
                                >
                                    Explore <FaArrowRight />
                                </motion.div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Quick Links Section */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                style={{
                    backgroundColor: '#2c3e50',
                    padding: '60px 20px',
                    color: 'white',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'radial-gradient(circle at 50% 50%, rgba(255,107,107,0.1) 0%, transparent 50%)',
                    pointerEvents: 'none'
                }} />
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '40px',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <motion.div
                        whileHover={{ y: -10 }}
                        style={{
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            padding: '30px',
                            borderRadius: '20px',
                            backdropFilter: 'blur(10px)'
                        }}
                    >
                        <h3 style={{
                            fontSize: '1.8rem',
                            marginBottom: '20px',
                            fontWeight: '700'
                        }}>
                            Share Your Recipes
                        </h3>
                        <p style={{
                            fontSize: '1.1rem',
                            lineHeight: '1.6',
                            marginBottom: '20px',
                            color: '#ecf0f1'
                        }}>
                            Join our community of food enthusiasts and share your favorite recipes with the world.
                        </p>
                        <Link to="/recipeadd" style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: '#FF6B6B',
                            textDecoration: 'none',
                            fontWeight: '600',
                            fontSize: '1.1rem'
                        }}>
                            Get Started <FaArrowRight />
                        </Link>
                    </motion.div>
                    <motion.div
                        whileHover={{ y: -10 }}
                        style={{
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            padding: '30px',
                            borderRadius: '20px',
                            backdropFilter: 'blur(10px)'
                        }}
                    >
                        <h3 style={{
                            fontSize: '1.8rem',
                            marginBottom: '20px',
                            fontWeight: '700'
                        }}>
                            Join Challenges
                        </h3>
                        <p style={{
                            fontSize: '1.1rem',
                            lineHeight: '1.6',
                            marginBottom: '20px',
                            color: '#ecf0f1'
                        }}>
                            Participate in cooking challenges and showcase your culinary skills.
                        </p>
                        <Link to="/displaychallengers" style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: '#FF6B6B',
                            textDecoration: 'none',
                            fontWeight: '600',
                            fontSize: '1.1rem'
                        }}>
                            View Challenges <FaArrowRight />
                        </Link>
                    </motion.div>
                    <motion.div
                        whileHover={{ y: -10 }}
                        style={{
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            padding: '30px',
                            borderRadius: '20px',
                            backdropFilter: 'blur(10px)'
                        }}
                    >
                        <h3 style={{
                            fontSize: '1.8rem',
                            marginBottom: '20px',
                            fontWeight: '700'
                        }}>
                            Explore Recipes
                        </h3>
                        <p style={{
                            fontSize: '1.1rem',
                            lineHeight: '1.6',
                            marginBottom: '20px',
                            color: '#ecf0f1'
                        }}>
                            Discover thousands of recipes from our community of passionate cooks.
                        </p>
                        <Link to="/displayrecipe" style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            color: '#FF6B6B',
                            textDecoration: 'none',
                            fontWeight: '600',
                            fontSize: '1.1rem'
                        }}>
                            Browse Recipes <FaArrowRight />
                        </Link>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}

export default Home;