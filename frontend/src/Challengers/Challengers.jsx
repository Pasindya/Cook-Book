import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { 
  FaHeart, FaRegHeart, FaShareAlt, FaClock, 
  FaTrophy, FaEllipsisH, FaRegBookmark, 
  FaBookmark, FaFireAlt, FaLeaf, FaEdit,
  FaTrash, FaComment, FaUser, FaStar, 
  FaRegStar, FaCalendarAlt, FaListAlt, FaUtensils, FaUsers, FaPlus
} from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Challengers() {
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
        const saved = JSON.parse(localStorage.getItem('savedChallenges')) || [];
        const liked = JSON.parse(localStorage.getItem('likedChallenges')) || [];
        setSavedChallenges(saved);
        setLikedChallenges(liked);
    }, []);

    const loadChallenges = async () => {
        try {
            const result = await axios.get(`http://localhost:8080/api/challengers`);
            setChallenges(result.data);
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

    const shareChallenge = async (challenge) => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: challenge.ChallengeTitle,
                    text: `Check out this cooking challenge!`,
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

    const navigateToChallenge = (challengeId) => {
        navigate(`/challenge/${challengeId}`);
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Not specified";
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                fontFamily: "'Poppins', sans-serif"
            }}>
                <div style={{
                    textAlign: 'center',
                    padding: '40px',
                    borderRadius: '12px',
                    background: '#fff',
                    boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
                }}>
                    <h2 style={{ color: '#333', marginBottom: '20px' }}>Loading culinary adventures...</h2>
                    <div style={{ 
                        width: '50px', 
                        height: '50px', 
                        border: '5px solid #f3f3f3',
                        borderTop: '5px solid #ff6b6b',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto'
                    }}></div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: '#fff9f5' }}>
            <Navbar />
            
            {/* Hero Section */}
            <div style={{
                position: 'relative',
                height: '600px',
                width: '100%',
                overflow: 'hidden',
                marginBottom: '50px'
            }}>
                {/* Background Image with Overlay */}
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: 'url("https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    filter: 'brightness(0.6)'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.4), rgba(0,0,0,0.8))'
                    }} />
                </div>

                {/* Hero Content */}
                <div style={{
                    position: 'relative',
                    zIndex: 2,
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '0 20px',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center'
                }}>
                    <div style={{
                        background: 'rgba(0, 0, 0, 0.5)',
                        padding: '40px 60px',
                        borderRadius: '20px',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        maxWidth: '900px'
                    }}>
                        <h1 style={{
                            color: '#fff',
                            fontSize: '4.5rem',
                            fontWeight: '800',
                            marginBottom: '25px',
                            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                            background: 'linear-gradient(45deg, #ff6b6b, #ff8e53)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            Culinary Masterpieces
                        </h1>
                        <p style={{
                            color: '#fff',
                            fontSize: '1.5rem',
                            maxWidth: '700px',
                            marginBottom: '40px',
                            textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                            lineHeight: '1.6'
                        }}>
                            Join the ultimate cooking competition platform. Showcase your skills, compete with top chefs, and win amazing prizes!
                        </p>

                        {/* Feature Cards */}
                        <div style={{
                            display: 'flex',
                            gap: '30px',
                            marginBottom: '40px',
                            justifyContent: 'center'
                        }}>
                            <div style={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                padding: '20px',
                                borderRadius: '15px',
                                backdropFilter: 'blur(5px)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                flex: 1,
                                maxWidth: '250px'
                            }}>
                                <FaTrophy style={{
                                    fontSize: '2.5rem',
                                    color: '#ffd700',
                                    marginBottom: '15px'
                                }} />
                                <h3 style={{
                                    color: '#fff',
                                    fontSize: '1.2rem',
                                    marginBottom: '10px'
                                }}>Win Prizes</h3>
                                <p style={{
                                    color: '#fff',
                                    fontSize: '0.9rem',
                                    opacity: 0.9
                                }}>Compete for exciting rewards and recognition</p>
                            </div>
                            <div style={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                padding: '20px',
                                borderRadius: '15px',
                                backdropFilter: 'blur(5px)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                flex: 1,
                                maxWidth: '250px'
                            }}>
                                <FaUsers style={{
                                    fontSize: '2.5rem',
                                    color: '#4CAF50',
                                    marginBottom: '15px'
                                }} />
                                <h3 style={{
                                    color: '#fff',
                                    fontSize: '1.2rem',
                                    marginBottom: '10px'
                                }}>Join Community</h3>
                                <p style={{
                                    color: '#fff',
                                    fontSize: '0.9rem',
                                    opacity: 0.9
                                }}>Connect with fellow cooking enthusiasts</p>
                            </div>
                            <div style={{
                                background: 'rgba(255, 255, 255, 0.1)',
                                padding: '20px',
                                borderRadius: '15px',
                                backdropFilter: 'blur(5px)',
                                border: '1px solid rgba(255, 255, 255, 0.2)',
                                flex: 1,
                                maxWidth: '250px'
                            }}>
                                <FaFireAlt style={{
                                    fontSize: '2.5rem',
                                    color: '#ff6b6b',
                                    marginBottom: '15px'
                                }} />
                                <h3 style={{
                                    color: '#fff',
                                    fontSize: '1.2rem',
                                    marginBottom: '10px'
                                }}>Show Skills</h3>
                                <p style={{
                                    color: '#fff',
                                    fontSize: '0.9rem',
                                    opacity: 0.9
                                }}>Display your culinary expertise</p>
                            </div>
                        </div>

                        {/* CTA Buttons */}
                        <div style={{
                            display: 'flex',
                            gap: '20px',
                            justifyContent: 'center'
                        }}>
                            <button 
                                onClick={() => navigate('/allchallengers')}
                                style={{
                                    padding: '15px 35px',
                                    borderRadius: '30px',
                                    border: 'none',
                                    background: 'linear-gradient(45deg, #ff6b6b, #ff8e53)',
                                    color: 'white',
                                    fontSize: '1.1rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 4px 15px rgba(255,107,107,0.3)'
                                }}
                            >
                                <FaFireAlt /> Explore Challenges
                            </button>
                            <button 
                                onClick={() => navigate('/addchallengers')}
                                style={{
                                    padding: '15px 35px',
                                    borderRadius: '30px',
                                    border: '2px solid #fff',
                                    background: 'transparent',
                                    color: 'white',
                                    fontSize: '1.1rem',
                                    fontWeight: '600',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <FaPlus /> Create Challenge
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '20px',
                fontFamily: "'Poppins', sans-serif",
                minHeight: '100vh'
            }}>
                
                <ToastContainer position="top-right" autoClose={3000} />
                
                {/* Challenges Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                    gap: '30px',
                    marginTop: '40px'
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
                                background: new Date(challenge.endDate) > new Date() ? 'rgba(255,107,107,0.9)' : 'rgba(136,136,136,0.9)',
                                padding: '5px 12px',
                                borderRadius: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                zIndex: '1',
                                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                                color: 'white',
                                fontWeight: '600',
                                fontSize: '0.8rem'
                            }}>
                                <FaTrophy />
                                {new Date(challenge.endDate) > new Date() ? 'Active' : 'Ended'}
                            </div>
                            
                            {/* Challenge Content */}
                            <div style={{ padding: '20px' }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'flex-start',
                                    marginBottom: '15px'
                                }}>
                                    <h2 style={{
                                        margin: '0',
                                        fontSize: '1.4rem',
                                        fontWeight: '600',
                                        color: '#333',
                                        lineHeight: '1.3',
                                        flex: '1'
                                    }}>
                                        {challenge.ChallengeTitle}
                                    </h2>
                                    
                                    <button 
                                        onClick={() => toggleSave(challenge.id)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: savedChallenges.includes(challenge.id) ? '#ff6b6b' : '#ddd',
                                            cursor: 'pointer',
                                            fontSize: '1.2rem',
                                            transition: 'all 0.2s ease',
                                            ':hover': {
                                                transform: 'scale(1.1)'
                                            }
                                        }}
                                    >
                                        {savedChallenges.includes(challenge.id) ? <FaBookmark /> : <FaRegBookmark />}
                                    </button>
                                </div>
                                
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '15px',
                                    marginBottom: '15px',
                                    color: '#666',
                                    fontSize: '0.9rem'
                                }}>
                                    <span style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px'
                                    }}>
                                        <FaCalendarAlt style={{ color: '#ff6b6b' }} />
                                        {formatDate(challenge.startDate)} - {formatDate(challenge.endDate)}
                                    </span>
                                    <span style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '5px'
                                    }}>
                                        <FaUtensils style={{ color: '#ff6b6b' }} />
                                        {challenge.difficulty || 'Medium'}
                                    </span>
                                </div>
                                
                                <p style={{
                                    color: '#555',
                                    fontSize: '0.95rem',
                                    lineHeight: '1.6',
                                    margin: '0 0 20px',
                                    display: '-webkit-box',
                                    WebkitLineClamp: '3',
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}>
                                    {challenge.challengeDetails || 'Join this exciting culinary challenge and showcase your cooking skills!'}
                                </p>
                                
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center'
                                }}>
                                    <button 
                                        onClick={() => navigateToChallenge(challenge.id)}
                                        style={{
                                            background: 'linear-gradient(45deg, #ff6b6b, #ff8e53)',
                                            color: 'white',
                                            border: 'none',
                                            padding: '10px 20px',
                                            borderRadius: '30px',
                                            cursor: 'pointer',
                                            fontSize: '0.95rem',
                                            fontWeight: '600',
                                            transition: 'all 0.3s ease',
                                            ':hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: '0 5px 15px rgba(255,107,107,0.3)'
                                            }
                                        }}
                                    >
                                        View Challenge Details
                                    </button>
                                    
                                    <div style={{
                                        display: 'flex',
                                        gap: '15px'
                                    }}>
                                        <button 
                                            onClick={() => toggleLike(challenge.id)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: likedChallenges.includes(challenge.id) ? '#ff6b6b' : '#ddd',
                                                cursor: 'pointer',
                                                fontSize: '1.2rem',
                                                transition: 'all 0.2s ease',
                                                ':hover': {
                                                    transform: 'scale(1.1)',
                                                    color: '#ff6b6b'
                                                }
                                            }}
                                        >
                                            {likedChallenges.includes(challenge.id) ? <FaHeart /> : <FaRegHeart />}
                                        </button>
                                        
                                        <button 
                                            onClick={() => shareChallenge(challenge)}
                                            style={{
                                                background: 'none',
                                                border: 'none',
                                                color: '#666',
                                                cursor: 'pointer',
                                                fontSize: '1.2rem',
                                                transition: 'all 0.2s ease',
                                                ':hover': {
                                                    transform: 'scale(1.1)',
                                                    color: '#3a86ff'
                                                }
                                            }}
                                        >
                                            <FaShareAlt />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Empty State */}
                {!loading && challenges.length === 0 && (
                    <div style={{
                        textAlign: 'center',
                        padding: '60px 20px',
                        margin: '40px 0',
                        borderRadius: '16px',
                        background: '#fff',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.05)'
                    }}>
                        <div style={{
                            width: '120px',
                            height: '120px',
                            background: '#fff0e6',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 30px',
                            color: '#ff6b6b',
                            fontSize: '3rem'
                        }}>
                            <FaUtensils />
                        </div>
                        <h2 style={{
                            color: '#333',
                            fontSize: '1.8rem',
                            marginBottom: '15px'
                        }}>
                            No Challenges Yet
                        </h2>
                        <p style={{
                            color: '#666',
                            fontSize: '1.1rem',
                            maxWidth: '600px',
                            margin: '0 auto 30px',
                            lineHeight: '1.6'
                        }}>
                            Be the first to create an exciting cooking challenge! Inspire others with your culinary creativity.
                        </p>
                        <button 
                            onClick={() => navigate('/allchallengers')}
                            style={{
                                background: 'linear-gradient(45deg, #ff6b6b, #ff8e53)',
                                color: 'white',
                                border: 'none',
                                padding: '12px 30px',
                                borderRadius: '30px',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                fontWeight: '600',
                                boxShadow: '0 4px 15px rgba(255,107,107,0.3)',
                                transition: 'all 0.3s ease',
                                ':hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 6px 20px rgba(255,107,107,0.4)'
                                }
                            }}
                        >
                            Explore Challengers
                        </button>
                        
                    </div>
                )}
                
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

export default Challengers;