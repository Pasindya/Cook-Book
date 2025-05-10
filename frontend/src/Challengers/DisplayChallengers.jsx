import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { 
  FaHeart, FaRegHeart, FaShareAlt, FaClock, 
  FaUtensils, FaEllipsisH, FaRegBookmark, 
  FaBookmark, FaFireAlt, FaLeaf, FaBreadSlice,
  FaEdit, FaTrash, FaComment, FaUser,
  FaStar, FaRegStar, FaTrophy, FaCalendarAlt,
  FaSearch, FaFilter, FaUsers, FaAward
} from 'react-icons/fa';
import { GiMeal, GiFruitBowl, GiChickenOven } from 'react-icons/gi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function DisplayChallengers() {
    const [challenges, setChallenges] = useState([]);
    const [filteredChallenges, setFilteredChallenges] = useState([]);
    const [upcomingChallenges, setUpcomingChallenges] = useState([]);
    const [activeChallenges, setActiveChallenges] = useState([]);
    const [pastChallenges, setPastChallenges] = useState([]);
    const [expandedChallenge, setExpandedChallenge] = useState(null);
    const [savedChallenges, setSavedChallenges] = useState([]);
    const [likedChallenges, setLikedChallenges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showMenu, setShowMenu] = useState(null);
    const [showCommentInput, setShowCommentInput] = useState(null);
    const [showReviewInput, setShowReviewInput] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [newReview, setNewReview] = useState({ rating: 0, text: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');
    const [participants, setParticipants] = useState({});
    const [showParticipants, setShowParticipants] = useState(null);
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
    
    useEffect(() => {
        if (searchTerm) {
            const filtered = challenges.filter(challenge => 
                challenge.ChallengeTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                challenge.challengeDetails.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredChallenges(filtered);
            categorizeChallenges(filtered);
        } else {
            setFilteredChallenges(challenges);
            categorizeChallenges(challenges);
        }
    }, [searchTerm, challenges]);
    
    const categorizeChallenges = (challenges) => {
        const today = new Date().toISOString().split('T')[0];
        
        const upcoming = challenges.filter(challenge => challenge.startDate > today);
        const active = challenges.filter(challenge => 
            challenge.startDate <= today && challenge.endDate >= today
        );
        const past = challenges.filter(challenge => challenge.endDate < today);
        
        setUpcomingChallenges(upcoming);
        setActiveChallenges(active);
        setPastChallenges(past);
    };
    
    const loadChallenges = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/challenges', {
                headers: {
                    'Content-Type': 'application/json',
                },
                timeout: 5000
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
            setFilteredChallenges(formattedChallenges);
            setLoading(false);
            
            // Load participants for each challenge
            loadParticipants(formattedChallenges);
        } catch (error) {
            console.error("Error loading challenges:", error);
            toast.error('Failed to load challenges');
            setLoading(false);
        }
    };
    
    const loadParticipants = async (challenges) => {
        const participantsData = {};
        for (const challenge of challenges) {
            try {
                const response = await axios.get(`http://localhost:8080/api/challenges/${challenge.id}/participants`);
                participantsData[challenge.id] = response.data || [];
            } catch (error) {
                console.error(`Error loading participants for challenge ${challenge.id}:`, error);
                participantsData[challenge.id] = [];
            }
        }
        setParticipants(participantsData);
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
    
    const toggleParticipants = (challengeId) => {
        setShowParticipants(showParticipants === challengeId ? null : challengeId);
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
                // Reload challenges to update categories
                loadChallenges();
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
    
    const handleJoinChallenge = async (challengeId) => {
        try {
            // In a real app, you would send the current user's ID
            await axios.post(`http://localhost:8080/api/challenges/${challengeId}/join`, {
                userId: 'current-user-id' // Replace with actual user ID
            });
            toast.success('You have joined this challenge!');
            // Refresh participants list
            loadParticipants(challenges);
        } catch (error) {
            console.error('Error joining challenge:', error);
            toast.error(error.response?.data || 'Failed to join challenge');
        }
    };

    const renderChallengeSection = (title, challenges, icon, color) => {
        if (challenges.length === 0) return null;
        
        return (
            <div style={{ marginBottom: '40px' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '20px',
                    paddingBottom: '10px',
                    borderBottom: `2px solid ${color}`
                }}>
                    <div style={{
                        background: color,
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '15px',
                        color: 'white'
                    }}>
                        {icon}
                    </div>
                    <h2 style={{
                        fontSize: '1.8rem',
                        fontWeight: '600',
                        color: '#333',
                        margin: '0'
                    }}>
                        {title} Challenges
                        <span style={{
                            fontSize: '1rem',
                            marginLeft: '10px',
                            color: '#666',
                            fontWeight: 'normal'
                        }}>
                            ({challenges.length})
                        </span>
                    </h2>
                </div>
                
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
                    gap: '30px'
                }}>
                    {challenges.map((challenge) => (
                        <ChallengeCard 
                            key={challenge.id}
                            challenge={challenge}
                            expandedChallenge={expandedChallenge}
                            toggleExpand={toggleExpand}
                            savedChallenges={savedChallenges}
                            toggleSave={toggleSave}
                            likedChallenges={likedChallenges}
                            toggleLike={toggleLike}
                            showMenu={showMenu}
                            toggleMenu={toggleMenu}
                            handleDelete={handleDelete}
                            handleUpdate={handleUpdate}
                            showCommentInput={showCommentInput}
                            toggleCommentInput={toggleCommentInput}
                            showReviewInput={showReviewInput}
                            toggleReviewInput={toggleReviewInput}
                            newComment={newComment}
                            setNewComment={setNewComment}
                            newReview={newReview}
                            setNewReview={setNewReview}
                            handleCommentSubmit={handleCommentSubmit}
                            handleReviewSubmit={handleReviewSubmit}
                            shareChallenge={shareChallenge}
                            formatDate={formatDate}
                            getStatusBadge={getStatusBadge}
                            participants={participants[challenge.id] || []}
                            showParticipants={showParticipants}
                            toggleParticipants={toggleParticipants}
                            handleJoinChallenge={handleJoinChallenge}
                        />
                    ))}
                </div>
            </div>
        );
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
                
                {/* Search and Filter Bar */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginBottom: '30px',
                    gap: '20px',
                    flexWrap: 'wrap'
                }}>
                    <div style={{
                        position: 'relative',
                        flexGrow: '1',
                        maxWidth: '500px'
                    }}>
                        <FaSearch style={{
                            position: 'absolute',
                            left: '15px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#999'
                        }} />
                        <input
                            type="text"
                            placeholder="Search challenges..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px 20px 12px 45px',
                                borderRadius: '30px',
                                border: '1px solid #ddd',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'all 0.3s ease',
                                ':focus': {
                                    borderColor: '#3a86ff',
                                    boxShadow: '0 0 0 3px rgba(58, 134, 255, 0.2)'
                                }
                            }}
                        />
                    </div>
                    
                    <div style={{
                        display: 'flex',
                        gap: '10px',
                        flexWrap: 'wrap'
                    }}>
                        <button 
                            onClick={() => setActiveFilter('all')}
                            style={{
                                background: activeFilter === 'all' ? '#3a86ff' : '#fff',
                                color: activeFilter === 'all' ? 'white' : '#333',
                                border: '1px solid #ddd',
                                padding: '10px 20px',
                                borderRadius: '30px',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                transition: 'all 0.2s ease',
                                ':hover': {
                                    background: activeFilter === 'all' ? '#2a6fd6' : '#f5f5f5'
                                }
                            }}
                        >
                            <FaFilter /> All Challenges
                        </button>
                        <button 
                            onClick={() => setActiveFilter('active')}
                            style={{
                                background: activeFilter === 'active' ? '#4CAF50' : '#fff',
                                color: activeFilter === 'active' ? 'white' : '#333',
                                border: '1px solid #ddd',
                                padding: '10px 20px',
                                borderRadius: '30px',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                transition: 'all 0.2s ease',
                                ':hover': {
                                    background: activeFilter === 'active' ? '#3e8e41' : '#f5f5f5'
                                }
                            }}
                        >
                            <FaFireAlt /> Active
                        </button>
                        <button 
                            onClick={() => setActiveFilter('upcoming')}
                            style={{
                                background: activeFilter === 'upcoming' ? '#2196F3' : '#fff',
                                color: activeFilter === 'upcoming' ? 'white' : '#333',
                                border: '1px solid #ddd',
                                padding: '10px 20px',
                                borderRadius: '30px',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                transition: 'all 0.2s ease',
                                ':hover': {
                                    background: activeFilter === 'upcoming' ? '#0b7dda' : '#f5f5f5'
                                }
                            }}
                        >
                            <FaCalendarAlt /> Upcoming
                        </button>
                        <button 
                            onClick={() => setActiveFilter('past')}
                            style={{
                                background: activeFilter === 'past' ? '#9E9E9E' : '#fff',
                                color: activeFilter === 'past' ? 'white' : '#333',
                                border: '1px solid #ddd',
                                padding: '10px 20px',
                                borderRadius: '30px',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                transition: 'all 0.2s ease',
                                ':hover': {
                                    background: activeFilter === 'past' ? '#757575' : '#f5f5f5'
                                }
                            }}
                        >
                            <FaTrophy /> Past
                        </button>
                        <button 
                            onClick={() => setActiveFilter('saved')}
                            style={{
                                background: activeFilter === 'saved' ? '#FFA500' : '#fff',
                                color: activeFilter === 'saved' ? 'white' : '#333',
                                border: '1px solid #ddd',
                                padding: '10px 20px',
                                borderRadius: '30px',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                transition: 'all 0.2s ease',
                                ':hover': {
                                    background: activeFilter === 'saved' ? '#e69500' : '#f5f5f5'
                                }
                            }}
                        >
                            <FaBookmark /> Saved
                        </button>
                    </div>
                </div>
                
                {/* Create Challenge Button */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    marginBottom: '30px'
                }}>
                    <button 
                        onClick={() => navigate('/addchallengers')}
                        style={{
                            background: 'linear-gradient(45deg, #FF6B6B, #FFA500)',
                            color: 'white',
                            border: 'none',
                            padding: '12px 25px',
                            borderRadius: '30px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 15px rgba(255,107,107,0.3)',
                            ':hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 20px rgba(255,107,107,0.4)'
                            }
                        }}
                    >
                        <FaFireAlt /> Create New Challenge
                    </button>
                </div>
                
                {/* Render appropriate challenges based on filter */}
                {activeFilter === 'all' && (
                    <>
                        {renderChallengeSection("Active", activeChallenges, <FaFireAlt />, "#4CAF50")}
                        {renderChallengeSection("Upcoming", upcomingChallenges, <FaCalendarAlt />, "#2196F3")}
                        {renderChallengeSection("Past", pastChallenges, <FaTrophy />, "#9E9E9E")}
                    </>
                )}
                {activeFilter === 'active' && renderChallengeSection("Active", activeChallenges, <FaFireAlt />, "#4CAF50")}
                {activeFilter === 'upcoming' && renderChallengeSection("Upcoming", upcomingChallenges, <FaCalendarAlt />, "#2196F3")}
                {activeFilter === 'past' && renderChallengeSection("Past", pastChallenges, <FaTrophy />, "#9E9E9E")}
                {activeFilter === 'saved' && renderChallengeSection("Saved", 
                    filteredChallenges.filter(challenge => savedChallenges.includes(challenge.id)), 
                    <FaBookmark />, "#FFA500"
                )}
                
                {filteredChallenges.length === 0 && !loading && (
                    <div style={{
                        textAlign: 'center',
                        padding: '40px',
                        background: '#fff',
                        borderRadius: '12px',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                        marginTop: '30px'
                    }}>
                        <FaTrophy style={{ fontSize: '3rem', color: '#FFA500', marginBottom: '20px' }} />
                        <h2 style={{ color: '#333', marginBottom: '15px' }}>No Challenges Found</h2>
                        <p style={{ color: '#666', marginBottom: '20px' }}>
                            {activeFilter === 'saved' 
                                ? "You haven't saved any challenges yet. Browse challenges and save your favorites!"
                                : "There are no cooking challenges matching your criteria. Try adjusting your filters or create your own challenge!"}
                        </p>
                        <button 
                            onClick={() => {
                                setActiveFilter('all');
                                setSearchTerm('');
                            }}
                            style={{
                                background: 'linear-gradient(45deg, #3a86ff, #4CAF50)',
                                color: 'white',
                                border: 'none',
                                padding: '12px 25px',
                                borderRadius: '30px',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                fontWeight: '600',
                                transition: 'all 0.3s ease',
                                marginRight: '10px',
                                ':hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 5px 15px rgba(58,134,255,0.3)'
                                }
                            }}
                        >
                            Browse All Challenges
                        </button>
                        <button 
                            onClick={() => navigate('/createchallenge')}
                            style={{
                                background: 'linear-gradient(45deg, #FF6B6B, #FFA500)',
                                color: 'white',
                                border: 'none',
                                padding: '12px 25px',
                                borderRadius: '30px',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                fontWeight: '600',
                                transition: 'all 0.3s ease',
                                ':hover': {
                                    transform: 'translateY(-2px)',
                                    boxShadow: '0 5px 15px rgba(255,107,107,0.3)'
                                }
                            }}
                        >
                            Create a Challenge
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
                    @keyframes slideIn {
                        from { opacity: 0; transform: translateX(20px); }
                        to { opacity: 1; transform: translateX(0); }
                    }
                `}</style>
            </div>
        </div>
    );
}

const ChallengeCard = ({
    challenge,
    expandedChallenge,
    toggleExpand,
    savedChallenges,
    toggleSave,
    likedChallenges,
    toggleLike,
    showMenu,
    toggleMenu,
    handleDelete,
    handleUpdate,
    showCommentInput,
    toggleCommentInput,
    showReviewInput,
    toggleReviewInput,
    newComment,
    setNewComment,
    newReview,
    setNewReview,
    handleCommentSubmit,
    handleReviewSubmit,
    shareChallenge,
    formatDate,
    getStatusBadge,
    participants,
    showParticipants,
    toggleParticipants,
    handleJoinChallenge
}) => {
    return (
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
                position: 'relative',
                cursor: 'pointer'
            }} onClick={() => toggleExpand(challenge.id)}>
                {challenge.challengeImage ? (
                    <img 
                        src={`http://localhost:8080/api/challenges/images/${challenge.challengeImage}`}
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
                ) : (
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
                )}
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
                    lineHeight: '1.3',
                    cursor: 'pointer'
                }} onClick={() => toggleExpand(challenge.id)}>{challenge.ChallengeTitle}</h2>
                
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '15px',
                    marginBottom: '15px',
                    flexWrap: 'wrap'
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
                    
                    <span style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        color: '#666',
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        ':hover': {
                            color: '#3a86ff'
                        }
                    }} onClick={(e) => {
                        e.stopPropagation();
                        toggleParticipants(challenge.id);
                    }}>
                        <FaUsers style={{ color: '#FFA500' }} />
                        {participants.length} Participants
                    </span>
                </div>
                
                {/* Participants Popup */}
                {showParticipants === challenge.id && (
                    <div style={{
                        position: 'absolute',
                        top: '100%',
                        left: '0',
                        right: '0',
                        background: '#fff',
                        borderRadius: '8px',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                        padding: '15px',
                        zIndex: '5',
                        marginTop: '5px',
                        animation: 'fadeIn 0.2s ease'
                    }}>
                        <h4 style={{
                            margin: '0 0 10px',
                            fontSize: '1rem',
                            color: '#333',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <FaUsers style={{ color: '#FFA500' }} />
                            Challenge Participants
                        </h4>
                        {participants.length > 0 ? (
                            <div style={{
                                maxHeight: '200px',
                                overflowY: 'auto',
                                paddingRight: '10px'
                            }}>
                                {participants.map((participant, index) => (
                                    <div key={index} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        padding: '8px 0',
                                        borderBottom: '1px solid #f0f0f0'
                                    }}>
                                        <div style={{
                                            width: '30px',
                                            height: '30px',
                                            borderRadius: '50%',
                                            background: '#f0f0f0',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <FaUser style={{ color: '#666', fontSize: '0.8rem' }} />
                                        </div>
                                        <span style={{
                                            fontSize: '0.9rem',
                                            color: '#333'
                                        }}>
                                            {participant.username || `Participant ${index + 1}`}
                                        </span>
                                        {participant.isWinner && (
                                            <span style={{
                                                marginLeft: 'auto',
                                                background: '#FFA500',
                                                color: 'white',
                                                fontSize: '0.7rem',
                                                padding: '3px 8px',
                                                borderRadius: '10px',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '3px'
                                            }}>
                                                <FaTrophy /> Winner
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{
                                color: '#666',
                                fontSize: '0.9rem',
                                textAlign: 'center',
                                padding: '10px 0'
                            }}>
                                No participants yet. Be the first to join!
                            </p>
                        )}
                        <button 
                            onClick={() => handleJoinChallenge(challenge.id)}
                            style={{
                                background: '#4CAF50',
                                color: 'white',
                                border: 'none',
                                padding: '8px 15px',
                                borderRadius: '20px',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                marginTop: '15px',
                                width: '100%',
                                transition: 'all 0.2s ease',
                                ':hover': {
                                    background: '#3e8e41'
                                }
                            }}
                        >
                            Join Challenge
                        </button>
                    </div>
                )}
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
                
                <button 
                    onClick={() => toggleSave(challenge.id)}
                    style={{
                        background: 'none',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: savedChallenges.includes(challenge.id) ? '#FFA500' : '#666',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        transition: 'all 0.2s ease',
                        ':hover': {
                            transform: 'scale(1.1)',
                            color: '#FFA500'
                        }
                    }}
                >
                    {savedChallenges.includes(challenge.id) ? <FaBookmark /> : <FaRegBookmark />}
                    <span>Save</span>
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
                            onClick={() => toggleCommentInput(null)}
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
                            onClick={() => toggleReviewInput(null)}
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
                    
                    <div style={{ marginTop: '20px' }}>
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
                            <FaAward style={{ color: '#FFA500' }} />
                            Prize Information
                        </h3>
                        <p style={{
                            color: '#555',
                            lineHeight: '1.8'
                        }}>
                            {challenge.prizeInfo || 'No prize information available.'}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DisplayChallengers;