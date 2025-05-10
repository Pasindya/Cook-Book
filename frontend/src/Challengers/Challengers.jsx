import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { 
  FaHeart, FaRegHeart, FaShareAlt, FaClock, 
  FaTrophy, FaEllipsisH, FaRegBookmark, 
  FaBookmark, FaFireAlt, FaLeaf, FaEdit,
  FaTrash, FaComment, FaUser, FaStar, 
  FaRegStar, FaCalendarAlt, FaListAlt, FaUtensils
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
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '20px',
                fontFamily: "'Poppins', sans-serif",
                minHeight: '100vh'
            }}>
                
                <ToastContainer position="top-right" autoClose={3000} />
                
                {/* Hero Section without Image */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    margin: '40px 0',
                    padding: '30px',
                    borderRadius: '20px',
                    background: 'linear-gradient(135deg, #fff0e6, #ffd9b3)',
                    boxShadow: '0 10px 30px rgba(255,107,107,0.1)',
                    textAlign: 'center'
                }}>
                    <h1 style={{
                        color: '#333',
                        fontSize: '2.8rem',
                        fontWeight: '700',
                        marginBottom: '15px',
                        background: 'linear-gradient(45deg, #ff6b6b, #ff8e53)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}>
                        Culinary Challenges
                    </h1>
                    <p style={{
                        color: '#555',
                        fontSize: '1.2rem',
                        maxWidth: '700px',
                        margin: '0 auto 25px',
                        lineHeight: '1.6'
                    }}>
                        Test your skills, push your boundaries, and create delicious masterpieces in our cooking challenges. 
                        Join a community of passionate food enthusiasts and compete for culinary glory!
                    </p>
                    <div style={{
                        display: 'flex',
                        gap: '15px',
                        marginBottom: '20px',
                        justifyContent: 'center'
                    }}>
                        <button 
                            onClick={() => navigate('/allchallengers')}
                            style={{
                                background: 'linear-gradient(45deg, #ff6b6b, #ff8e53)',
                                color: 'white',
                                border: 'none',
                                padding: '12px 25px',
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
                </div>
                
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