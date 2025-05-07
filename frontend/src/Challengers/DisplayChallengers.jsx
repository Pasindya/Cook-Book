import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { 
  FaHeart, FaRegHeart, FaShareAlt, FaClock, 
  FaUtensils, FaEllipsisH, FaRegBookmark, 
  FaBookmark, FaFireAlt, FaLeaf, FaBreadSlice,
  FaEdit, FaTrash, FaComment, FaUser,
  FaStar, FaRegStar, FaTrophy, FaCalendarAlt
} from 'react-icons/fa';
import { GiMeal, GiFruitBowl, GiChickenOven } from 'react-icons/gi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function DisplayChallengers() {
    const [challenges, setChallenges] = useState([]);
    const [expandedChallenge, setExpandedChallenge] = useState(null);
    const [savedChallenges, setSavedChallenges] = useState([]);
    const [likedChallenges, setLikedChallenges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showMenu, setShowMenu] = useState(null);
    const [showCommentInput, setShowCommentInput] = useState(null);
    const [showReviewInput, setShowReviewInput] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [newReview, setNewReview] = useState({ rating: 0, text: '' });
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        loadChallenges();
        // Load saved challenges from localStorage if available
        const saved = JSON.parse(localStorage.getItem('savedChallenges')) || [];
        const liked = JSON.parse(localStorage.getItem('likedChallenges')) || [];
        setSavedChallenges(saved);
        setLikedChallenges(liked);
    }, []);
    
    
    const loadChallenges = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/challenges', {
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 5000 // 5 second timeout
            });
            
            if (!response.data) {
                throw new Error('No data received from server');
            }
            
            // Transform data to ensure proper formatting
            const formattedChallenges = response.data.map(challenge => ({
                ...challenge,
                startDate: challenge.startDate || new Date().toISOString().split('T')[0],
                endDate: challenge.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                challengeImage: challenge.challengeImage || null
            }));
            
            setChallenges(formattedChallenges);
            setLoading(false);
        } catch (error) {
            console.error("Error loading challenges:", error);
            toast.error('Failed to load challenges');
            setLoading(false);
        }
    };

    const toggleExpand = (challengeId) => {
        setExpandedChallenge(expandedChallenge === challengeId ? null : challengeId);
    };

    const toggleSave = (challengeId) => {
        let updatedSavedChallenges;
        if (savedChallenges.includes(challengeId)) {
            updatedSavedChallenges = savedChallenges.filter(id => id !== challengeId);
            toast.info('Challenge removed from saved');
        } else {
            updatedSavedChallenges = [...savedChallenges, challengeId];
            toast.success('Challenge saved!');
        }
        setSavedChallenges(updatedSavedChallenges);
        localStorage.setItem('savedChallenges', JSON.stringify(updatedSavedChallenges));
    };

    const toggleLike = (challengeId) => {
        let updatedLikedChallenges;
        if (likedChallenges.includes(challengeId)) {
            updatedLikedChallenges = likedChallenges.filter(id => id !== challengeId);
        } else {
            updatedLikedChallenges = [...likedChallenges, challengeId];
            toast('❤️ Liked!', { autoClose: 1000 });
        }
        setLikedChallenges(updatedLikedChallenges);
        localStorage.setItem('likedChallenges', JSON.stringify(updatedLikedChallenges));
    };

    const toggleMenu = (challengeId, e) => {
        e.stopPropagation();
        setShowMenu(showMenu === challengeId ? null : challengeId);
    };

    const handleDelete = async (challengeId) => {
        if (window.confirm('Are you sure you want to delete this challenge? This action cannot be undone.')) {
            try {
                await axios.delete(`http://localhost:8080/api/challenges/${challengeId}`);
                toast.success('Challenge deleted successfully');
                // Remove the deleted challenge from the state
                setChallenges(challenges.filter(challenge => challenge.id !== challengeId));
                // Close the menu
                setShowMenu(null);
            } catch (error) {
                console.error("Error deleting challenge:", error);
                toast.error(error.response?.data || 'Failed to delete challenge');
            }
        }
    };

    const toggleCommentInput = (challengeId) => {
        setShowCommentInput(showCommentInput === challengeId ? null : challengeId);
        setShowReviewInput(null);
    };

    const toggleReviewInput = (challengeId) => {
        setShowReviewInput(showReviewInput === challengeId ? null : challengeId);
        setShowCommentInput(null);
    };

    const handleCommentSubmit = (challengeId) => {
        if (!newComment.trim()) return;
        
        toast.success('Comment submitted! (Would be saved to database in production)');
        setNewComment('');
        setShowCommentInput(null);
    };

    const handleReviewSubmit = (challengeId) => {
        if (!newReview.text.trim() || newReview.rating === 0) {
            toast.error('Please add both a rating and review text');
            return;
        }
        
        toast.success(`Review submitted! Rating: ${newReview.rating}, Text: ${newReview.text}`);
        setNewReview({ rating: 0, text: '' });
        setShowReviewInput(null);
    };

    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return 'Invalid date';
        }
    };

    const getStatusBadge = (startDate, endDate) => {
        const today = new Date().toISOString().split('T')[0];
        
        if (startDate > today) {
            return <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">Upcoming</span>;
        } else if (endDate < today) {
            return <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">Completed</span>;
        } else {
            return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Active</span>;
        }
    };

    const shareChallenge = async (challenge) => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: challenge.ChallengeTitle,
                    text: `Check out this cooking challenge: ${challenge.challengeDetails}`,
                    url: window.location.href,
                });
            } else {
                await navigator.clipboard.writeText(window.location.href);
                toast.info('Link copied to clipboard!');
            }
        } catch (error) {
            console.error('Error sharing:', error);
            toast.error('Failed to share challenge');
        }
    };

    const handleUpdate = (challengeId) => {
        navigate(`/updatechallenge/${challengeId}`);
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
                    <h2 style={{ color: '#333', marginBottom: '20px' }}>Loading cooking challenges...</h2>
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
                        background: 'linear-gradient(45deg, #FF6B6B, #FFA500)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        display: 'inline-block'
                    }}>Cooking Challenges</h1>
                    <p style={{
                        color: '#666',
                        fontSize: '1.1rem',
                        maxWidth: '700px',
                        margin: '0 auto'
                    }}>Discover exciting cooking competitions and showcase your culinary skills</p>
                </div>
                
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                    gap: '30px',
                    marginTop: '20px'
                }}>
                    {challenges.map((challenge) => (
                        <div key={challenge.id} style={{
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
                            {/* Challenge Status Badge */}
                            <div style={{
                                position: 'absolute',
                                top: '15px',
                                right: '15px',
                                zIndex: '1'
                            }}>
                                {getStatusBadge(challenge.startDate, challenge.endDate)}
                            </div>
                            
                            {/* Three Dots Menu */}
                            <div style={{
                                position: 'absolute',
                                top: '15px',
                                left: '15px',
                                zIndex: '2'
                            }}>
                                <button 
                                    onClick={(e) => toggleMenu(challenge.id, e)}
                                    style={{
                                        background: 'rgba(255,255,255,0.9)',
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '36px',
                                        height: '36px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                        transition: 'all 0.2s ease',
                                        ':hover': {
                                            background: '#f0f0f0'
                                        }
                                    }}
                                >
                                    <FaEllipsisH />
                                </button>
                                
                                {showMenu === challenge.id && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '40px',
                                        left: '0',
                                        background: '#fff',
                                        borderRadius: '8px',
                                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                                        width: '160px',
                                        overflow: 'hidden',
                                        zIndex: '10',
                                        animation: 'fadeIn 0.2s ease'
                                    }}>
                                        <button onClick={() => handleUpdate(challenge.id)}
                                        style={{
                                            width: '100%',
                                            padding: '10px 15px',
                                            border: 'none',
                                            background: 'none',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            cursor: 'pointer',
                                            fontSize: '0.9rem',
                                            color: '#333',
                                            ':hover': {
                                                background: '#f5f5f5'
                                            }
                                        }}>
                                            <FaEdit style={{ color: '#3a86ff' }} />
                                            Update
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(challenge.id)}
                                            style={{
                                                width: '100%',
                                                padding: '10px 15px',
                                                border: 'none',
                                                background: 'none',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px',
                                                cursor: 'pointer',
                                                fontSize: '0.9rem',
                                                color: '#ff6b6b',
                                                ':hover': {
                                                    background: '#f5f5f5'
                                                }
                                            }}
                                        >
                                            <FaTrash />
                                            Delete
                                        </button>
                                    </div>
                                )}
                            </div>
                            
                            {/* Challenge Image */}
                            <div style={{
                                width: '100%',
                                height: '250px',
                                overflow: 'hidden',
                                position: 'relative'
                            }}>
                                    <img 
                                        src={`http://localhost:8080/uploads/${challenge.challengeImage}`}
                                        alt={challenge.ChallengeTitle}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                            transition: 'transform 0.5s ease'
                                        }}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = 'https://via.placeholder.com/400x250?text=Challenge+Image';
                                        }}
                                    />
                                 
                                    <div style={{
                                        width: '100%',
                                        height: '100%',
                                        background: 'linear-gradient(45deg, #FF6B6B, #FFA500)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <FaTrophy style={{ color: 'white', fontSize: '3rem' }} />
                                    </div>
                                
                                <div style={{
                                    position: 'absolute',
                                    bottom: '0',
                                    left: '0',
                                    right: '0',
                                    height: '60px',
                                    background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)'
                                }}></div>
                            </div>
                            
                            {/* Challenge Header */}
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
                                }}>{challenge.ChallengeTitle}</h2>
                                
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
                                        <FaCalendarAlt style={{ color: '#3a86ff' }} />
                                        {formatDate(challenge.startDate)} - {formatDate(challenge.endDate)}
                                    </span>
                                </div>
                            </div>
                            
                            {/* Challenge Actions */}
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                padding: '0 20px 15px',
                                borderBottom: '1px solid #eee'
                            }}>
                                <button 
                                    onClick={() => toggleLike(challenge.id)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        color: likedChallenges.includes(challenge.id) ? '#ff6b6b' : '#666',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem',
                                        transition: 'all 0.2s ease',
                                        ':hover': {
                                            transform: 'scale(1.1)'
                                        }
                                    }}
                                >
                                    {likedChallenges.includes(challenge.id) ? <FaHeart /> : <FaRegHeart />}
                                    <span>Like</span>
                                </button>
                                
                                <button 
                                    onClick={() => toggleCommentInput(challenge.id)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        color: showCommentInput === challenge.id ? '#3a86ff' : '#666',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem',
                                        transition: 'all 0.2s ease',
                                        ':hover': {
                                            transform: 'scale(1.1)',
                                            color: '#3a86ff'
                                        }
                                    }}
                                >
                                    <FaComment />
                                    <span>Comment</span>
                                </button>
                                
                                <button 
                                    onClick={() => toggleReviewInput(challenge.id)}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        color: showReviewInput === challenge.id ? '#FFA500' : '#666',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem',
                                        transition: 'all 0.2s ease',
                                        ':hover': {
                                            transform: 'scale(1.1)',
                                            color: '#FFA500'
                                        }
                                    }}
                                >
                                    <FaStar />
                                    <span>Review</span>
                                </button>
                                
                                <button 
                                    onClick={() => shareChallenge(challenge)}
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
                            </div>
                            
                            {/* Comment Input */}
                            {showCommentInput === challenge.id && (
                                <div style={{
                                    padding: '15px 20px',
                                    borderBottom: '1px solid #eee',
                                    backgroundColor: '#f8f9fa'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        gap: '10px',
                                        marginBottom: '10px'
                                    }}>
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            background: '#f0f0f0',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: '0'
                                        }}>
                                            <FaUser style={{ color: '#666' }} />
                                        </div>
                                        <textarea
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                            placeholder="Write a comment..."
                                            style={{
                                                flexGrow: '1',
                                                padding: '10px',
                                                borderRadius: '18px',
                                                border: '1px solid #ddd',
                                                minHeight: '40px',
                                                resize: 'none',
                                                fontFamily: 'inherit',
                                                fontSize: '0.9rem'
                                            }}
                                        />
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        gap: '10px'
                                    }}>
                                        <button
                                            onClick={() => setShowCommentInput(null)}
                                            style={{
                                                background: '#f0f0f0',
                                                color: '#333',
                                                border: 'none',
                                                padding: '8px 15px',
                                                borderRadius: '18px',
                                                cursor: 'pointer',
                                                fontSize: '0.9rem',
                                                transition: 'all 0.2s ease',
                                                ':hover': {
                                                    background: '#e0e0e0'
                                                }
                                            }}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => handleCommentSubmit(challenge.id)}
                                            style={{
                                                background: '#3a86ff',
                                                color: 'white',
                                                border: 'none',
                                                padding: '8px 15px',
                                                borderRadius: '18px',
                                                cursor: 'pointer',
                                                fontSize: '0.9rem',
                                                transition: 'all 0.2s ease',
                                                ':hover': {
                                                    background: '#2a6fd6'
                                                }
                                            }}
                                        >
                                            Post
                                        </button>
                                    </div>
                                </div>
                            )}
                            
                            {/* Review Input */}
                            {showReviewInput === challenge.id && (
                                <div style={{
                                    padding: '15px 20px',
                                    borderBottom: '1px solid #eee',
                                    backgroundColor: '#f8f9fa'
                                }}>
                                    <div style={{
                                        display: 'flex',
                                        gap: '10px',
                                        marginBottom: '10px'
                                    }}>
                                        <div style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '50%',
                                            background: '#f0f0f0',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            flexShrink: '0'
                                        }}>
                                            <FaUser style={{ color: '#666' }} />
                                        </div>
                                        <div style={{ flexGrow: '1' }}>
                                            <div style={{
                                                display: 'flex',
                                                gap: '5px',
                                                marginBottom: '10px'
                                            }}>
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        onClick={() => setNewReview({...newReview, rating: star})}
                                                        style={{
                                                            background: 'none',
                                                            border: 'none',
                                                            cursor: 'pointer',
                                                            fontSize: '1.2rem',
                                                            color: star <= newReview.rating ? '#FFA500' : '#ddd'
                                                        }}
                                                    >
                                                        {star <= newReview.rating ? <FaStar /> : <FaRegStar />}
                                                    </button>
                                                ))}
                                            </div>
                                            <textarea
                                                value={newReview.text}
                                                onChange={(e) => setNewReview({...newReview, text: e.target.value})}
                                                placeholder="Write your review..."
                                                style={{
                                                    width: '100%',
                                                    padding: '10px',
                                                    borderRadius: '18px',
                                                    border: '1px solid #ddd',
                                                    minHeight: '80px',
                                                    resize: 'none',
                                                    fontFamily: 'inherit',
                                                    fontSize: '0.9rem'
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'flex-end',
                                        gap: '10px'
                                    }}>
                                        <button
                                            onClick={() => setShowReviewInput(null)}
                                            style={{
                                                background: '#f0f0f0',
                                                color: '#333',
                                                border: 'none',
                                                padding: '8px 15px',
                                                borderRadius: '18px',
                                                cursor: 'pointer',
                                                fontSize: '0.9rem',
                                                transition: 'all 0.2s ease',
                                                ':hover': {
                                                    background: '#e0e0e0'
                                                }
                                            }}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={() => handleReviewSubmit(challenge.id)}
                                            style={{
                                                background: '#FFA500',
                                                color: 'white',
                                                border: 'none',
                                                padding: '8px 15px',
                                                borderRadius: '18px',
                                                cursor: 'pointer',
                                                fontSize: '0.9rem',
                                                transition: 'all 0.2s ease',
                                                ':hover': {
                                                    background: '#e69500'
                                                }
                                            }}
                                        >
                                            Submit Review
                                        </button>
                                    </div>
                                </div>
                            )}
                            
                            {/* Challenge Preview */}
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
                                }}>{challenge.challengeDetails}</p>
                                
                                <button 
                                    onClick={() => toggleExpand(challenge.id)}
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
                                    {expandedChallenge === challenge.id ? 'Show less' : 'Show more'}
                                </button>
                            </div>
                            
                            {/* Expanded Challenge Details */}
                            {expandedChallenge === challenge.id && (
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
                                            <FaTrophy style={{ color: '#FFA500' }} />
                                            Challenge Details
                                        </h3>
                                        <p style={{
                                            color: '#555',
                                            lineHeight: '1.8',
                                            marginBottom: '15px'
                                        }}>
                                            {challenge.challengeDetails}
                                        </p>
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
                                            <FaFireAlt style={{ color: '#FF6B6B' }} />
                                            Rules
                                        </h3>
                                        <ul style={{
                                            margin: '0',
                                            paddingLeft: '20px',
                                            color: '#555',
                                            lineHeight: '1.8'
                                        }}>
                                            {challenge.Rules.split('\n').filter(rule => rule.trim()).map((rule, i) => (
                                                <li key={i} style={{ 
                                                    marginBottom: '5px',
                                                    position: 'relative',
                                                    paddingLeft: '20px'
                                                }}>
                                                    <span style={{
                                                        position: 'absolute',
                                                        left: '0',
                                                        color: '#FF6B6B'
                                                    }}>•</span>
                                                    {rule}
                                                </li>
                                            ))}
                                        </ul>
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

export default DisplayChallengers;