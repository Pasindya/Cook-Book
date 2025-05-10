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
            
            console.log('Raw challenge data from server:', response.data); // Debug log
            
            // Transform data to ensure proper formatting
            const formattedChallenges = response.data.map(challenge => {
                console.log('Processing challenge:', challenge); // Debug log for each challenge
                const formattedChallenge = {
                    ...challenge,
                    ChallengeTitle: challenge.ChallengeTitle || challenge.challengeTitle, // Try both cases
                    startDate: challenge.startDate || new Date().toISOString().split('T')[0],
                    endDate: challenge.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                    challengeImage: challenge.challengeImage || null
                };
                console.log('Formatted challenge:', formattedChallenge); // Debug log for formatted challenge
                return formattedChallenge;
            });
            
            console.log('All formatted challenges:', formattedChallenges); // Debug log
            
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
    console.log('Rendering challenge card with data:', challenge); // Debug log for card rendering
    return (
        <div key={challenge.id} style={styles.challengeCard}>
            {/* Status Badge */}
            <div style={styles.statusBadge}>
                {getStatusBadge(challenge.startDate, challenge.endDate)}
            </div>
            
            {/* Three Dots Menu */}
            <div style={styles.menuContainer}>
                <button 
                    onClick={(e) => toggleMenu(challenge.id, e)}
                    style={styles.menuButton}
                >
                    <FaEllipsisH />
                </button>
                
                {showMenu === challenge.id && (
                    <div style={styles.menuDropdown}>
                        <button 
                            onClick={() => handleUpdate(challenge.id)}
                            style={styles.menuItem}
                        >
                            <FaEdit style={{ color: '#3a86ff' }} />
                            Edit Challenge
                        </button>
                        <button 
                            onClick={() => handleDelete(challenge.id)}
                            style={styles.menuItem}
                        >
                            <FaTrash style={{ color: '#ff6b6b' }} />
                            Delete Challenge
                        </button>
                    </div>
                )}
            </div>
            
            {/* Challenge Image */}
            <div style={styles.imageContainer}>
                {challenge.challengeImage ? (
                    <div style={styles.imageWrapper}>
                        <img 
                            src={`http://localhost:8080/api/challenges/images/${challenge.challengeImage}`}
                            alt={challenge.ChallengeTitle}
                            style={styles.challengeImage}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/400x250?text=Challenge+Image';
                            }}
                        />
                        <div style={styles.imageOverlay} />
                    </div>
                ) : (
                    <div style={styles.placeholderImage}>
                        <FaTrophy style={styles.placeholderIcon} />
                    </div>
                )}
            </div>
            
            {/* Challenge Content */}
            <div style={styles.challengeContent}>
                {/* Title Section */}
                <div style={styles.titleSection}>
                    <h3 style={styles.challengeTitle}>
                        {challenge.ChallengeTitle || challenge.challengeTitle || 'Untitled Challenge'} {/* Try both cases */}
                    </h3>
                    <div style={styles.dateContainer}>
                        <FaCalendarAlt style={styles.dateIcon} />
                        <span style={styles.dateText}>
                            {formatDate(challenge.startDate)} - {formatDate(challenge.endDate)}
                        </span>
                    </div>
                </div>

                {/* Challenge Details */}
                <div style={styles.detailsSection}>
                    <div style={styles.detailsHeader}>
                        <FaUtensils style={styles.detailsIcon} />
                        <span style={styles.detailsTitle}>Challenge Details</span>
                    </div>
                    <p style={styles.challengeDescription}>
                        {challenge.challengeDetails}
                    </p>
                </div>

                {/* Rules Section */}
                {challenge.Rules && (
                    <div style={styles.rulesSection}>
                        <div style={styles.detailsHeader}>
                            <FaLeaf style={styles.detailsIcon} />
                            <span style={styles.detailsTitle}>Rules & Guidelines</span>
                        </div>
                        <p style={styles.rulesText}>
                            {challenge.Rules}
                        </p>
                    </div>
                )}

                {/* Prize Information */}
                {challenge.prizeInfo && (
                    <div style={styles.prizeSection}>
                        <div style={styles.detailsHeader}>
                            <FaTrophy style={styles.detailsIcon} />
                            <span style={styles.detailsTitle}>Prize Information</span>
                        </div>
                        <p style={styles.prizeText}>
                            {challenge.prizeInfo}
                        </p>
                    </div>
                )}
                
                {/* Challenge Stats */}
                <div style={styles.statsContainer}>
                    <div style={styles.stat}>
                        <FaUsers style={styles.statIcon} /> 
                        <div style={styles.statContent}>
                            <span style={styles.statValue}>{participants?.length || 0}</span>
                            <span style={styles.statLabel}>Participants</span>
                        </div>
                    </div>
                    <div style={styles.stat}>
                        <FaHeart style={styles.statIcon} /> 
                        <div style={styles.statContent}>
                            <span style={styles.statValue}>{challenge.likes || 0}</span>
                            <span style={styles.statLabel}>Likes</span>
                        </div>
                    </div>
                    <div style={styles.stat}>
                        <FaComment style={styles.statIcon} /> 
                        <div style={styles.statContent}>
                            <span style={styles.statValue}>{challenge.comments?.length || 0}</span>
                            <span style={styles.statLabel}>Comments</span>
                        </div>
                    </div>
                </div>

                {/* Participants Section */}
                {participants && participants.length > 0 && (
                    <div style={styles.participantsSection}>
                        <div style={styles.detailsHeader}>
                            <FaUsers style={styles.detailsIcon} />
                            <span style={styles.detailsTitle}>Participants</span>
                            <span style={styles.participantCount}>({participants.length})</span>
                        </div>
                        <div style={styles.participantsList}>
                            {participants.slice(0, 5).map((participant, index) => (
                                <div key={index} style={styles.participantItem}>
                                    <FaUser style={styles.participantIcon} />
                                    <span style={styles.participantName}>{participant.username}</span>
                                </div>
                            ))}
                            {participants.length > 5 && (
                                <button 
                                    onClick={() => toggleParticipants(challenge.id)}
                                    style={styles.viewMoreButton}
                                >
                                    View All Participants
                                </button>
                            )}
                        </div>
                    </div>
                )}
                
                {/* Action Buttons */}
                <div style={styles.actionButtons}>
                    <button 
                        onClick={() => handleJoinChallenge(challenge.id)}
                        style={styles.joinButton}
                    >
                        <FaUsers style={styles.actionIcon} />
                        <span>Join Challenge</span>
                    </button>
                    
                    <button 
                        onClick={() => toggleLike(challenge.id)}
                        style={{
                            ...styles.actionButton,
                            backgroundColor: likedChallenges.includes(challenge.id) ? 'rgba(255, 107, 107, 0.1)' : '#f8f9fa'
                        }}
                    >
                        {likedChallenges.includes(challenge.id) ? 
                            <FaHeart style={{ ...styles.actionIcon, color: '#ff6b6b' }} /> : 
                            <FaRegHeart style={styles.actionIcon} />
                        }
                        <span>Like</span>
                    </button>
                    
                    <button 
                        onClick={() => toggleCommentInput(challenge.id)}
                        style={styles.actionButton}
                    >
                        <FaComment style={styles.actionIcon} />
                        <span>Comment</span>
                    </button>
                    
                    <button 
                        onClick={() => toggleSave(challenge.id)}
                        style={{
                            ...styles.actionButton,
                            backgroundColor: savedChallenges.includes(challenge.id) ? 'rgba(58, 134, 255, 0.1)' : '#f8f9fa'
                        }}
                    >
                        {savedChallenges.includes(challenge.id) ? 
                            <FaBookmark style={{ ...styles.actionIcon, color: '#3a86ff' }} /> : 
                            <FaRegBookmark style={styles.actionIcon} />
                        }
                        <span>Save</span>
                    </button>
                </div>
                
                {/* Comment Input */}
                {showCommentInput === challenge.id && (
                    <div style={styles.commentInputContainer}>
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            style={styles.commentInput}
                        />
                        <button 
                            onClick={() => handleCommentSubmit(challenge.id)}
                            style={styles.submitButton}
                        >
                            Post Comment
                        </button>
                    </div>
                )}

                {/* Review Input */}
                {showReviewInput === challenge.id && (
                    <div style={styles.reviewInputContainer}>
                        <div style={styles.ratingContainer}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <FaStar
                                    key={star}
                                    style={{
                                        ...styles.starIcon,
                                        color: star <= newReview.rating ? '#FFA500' : '#ddd'
                                    }}
                                    onClick={() => setNewReview(prev => ({ ...prev, rating: star }))}
                                />
                            ))}
                        </div>
                        <textarea
                            value={newReview.text}
                            onChange={(e) => setNewReview(prev => ({ ...prev, text: e.target.value }))}
                            placeholder="Write your review..."
                            style={styles.reviewInput}
                        />
                        <button 
                            onClick={() => handleReviewSubmit(challenge.id)}
                            style={styles.submitButton}
                        >
                            Submit Review
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const styles = {
    challengeCard: {
        background: '#fff',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        position: 'relative',
        marginBottom: '30px'
    },
    statusBadge: {
        position: 'absolute',
        top: '20px',
        right: '20px',
        zIndex: '2'
    },
    menuContainer: {
        position: 'absolute',
        top: '20px',
        left: '20px',
        zIndex: '2'
    },
    menuButton: {
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
        transition: 'all 0.2s ease'
    },
    menuDropdown: {
        position: 'absolute',
        top: '100%',
        left: '0',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
        marginTop: '10px',
        overflow: 'hidden',
        minWidth: '180px'
    },
    menuItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '12px 15px',
        width: '100%',
        border: 'none',
        background: 'none',
        cursor: 'pointer',
        fontSize: '0.95rem',
        transition: 'all 0.2s ease',
        ':hover': {
            background: '#f8f9fa'
        }
    },
    imageContainer: {
        width: '100%',
        height: '280px',
        position: 'relative',
        overflow: 'hidden'
    },
    imageWrapper: {
        width: '100%',
        height: '100%',
        position: 'relative'
    },
    challengeImage: {
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        transition: 'transform 0.3s ease'
    },
    imageOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.3))'
    },
    placeholderImage: {
        width: '100%',
        height: '100%',
        background: 'linear-gradient(45deg, #FF6B6B, #FFA500)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    placeholderIcon: {
        color: 'white',
        fontSize: '4rem',
        opacity: 0.8
    },
    challengeContent: {
        padding: '25px'
    },
    titleSection: {
        marginBottom: '20px',
        paddingBottom: '15px',
        borderBottom: '1px solid #eee'
    },
    challengeTitle: {
        fontSize: '1.8rem',
        color: '#333',
        marginBottom: '12px',
        fontWeight: '700',
        lineHeight: '1.3',
        letterSpacing: '-0.5px'
    },
    dateContainer: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        color: '#666'
    },
    dateIcon: {
        color: '#3a86ff',
        fontSize: '1.1rem'
    },
    dateText: {
        fontSize: '0.95rem',
        fontWeight: '500'
    },
    detailsSection: {
        marginBottom: '20px',
        padding: '15px',
        background: '#f8f9fa',
        borderRadius: '12px'
    },
    detailsHeader: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '12px'
    },
    detailsIcon: {
        color: '#FF6B6B',
        fontSize: '1.2rem'
    },
    detailsTitle: {
        fontSize: '1.1rem',
        fontWeight: '600',
        color: '#333'
    },
    challengeDescription: {
        color: '#555',
        lineHeight: '1.6',
        fontSize: '1rem',
        marginBottom: '0'
    },
    rulesSection: {
        marginBottom: '20px',
        padding: '15px',
        background: '#fff',
        borderRadius: '12px',
        border: '1px solid #eee'
    },
    rulesText: {
        color: '#666',
        lineHeight: '1.6',
        fontSize: '0.95rem',
        marginBottom: '0'
    },
    prizeSection: {
        marginBottom: '20px',
        padding: '15px',
        background: '#fff8e1',
        borderRadius: '12px',
        border: '1px solid #ffe0b2'
    },
    prizeText: {
        color: '#666',
        lineHeight: '1.6',
        fontSize: '0.95rem',
        marginBottom: '0'
    },
    participantsSection: {
        marginBottom: '20px',
        padding: '15px',
        background: '#f8f9fa',
        borderRadius: '12px'
    },
    participantCount: {
        fontSize: '0.9rem',
        color: '#666',
        marginLeft: '5px'
    },
    participantsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
    },
    participantItem: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '8px',
        background: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
    },
    participantIcon: {
        color: '#666',
        fontSize: '1rem'
    },
    participantName: {
        fontSize: '0.95rem',
        color: '#333'
    },
    viewMoreButton: {
        background: 'none',
        border: 'none',
        color: '#3a86ff',
        fontSize: '0.9rem',
        cursor: 'pointer',
        padding: '5px 0',
        textAlign: 'center',
        ':hover': {
            textDecoration: 'underline'
        }
    },
    statsContainer: {
        display: 'flex',
        justifyContent: 'space-between',
        gap: '15px',
        marginBottom: '25px',
        padding: '15px',
        background: '#f8f9fa',
        borderRadius: '12px'
    },
    stat: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        flex: 1
    },
    statContent: {
        display: 'flex',
        flexDirection: 'column'
    },
    statValue: {
        fontSize: '1.1rem',
        fontWeight: '600',
        color: '#333'
    },
    statLabel: {
        fontSize: '0.85rem',
        color: '#666'
    },
    statIcon: {
        color: '#FF6B6B',
        fontSize: '1.3rem'
    },
    actionButtons: {
        display: 'flex',
        gap: '12px',
        marginBottom: '20px'
    },
    joinButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 20px',
        border: 'none',
        borderRadius: '25px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        fontSize: '0.95rem',
        color: 'white',
        background: 'linear-gradient(45deg, #FF6B6B, #FFA500)',
        flex: 1,
        justifyContent: 'center',
        fontWeight: '500',
        ':hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 5px 15px rgba(255, 107, 107, 0.3)'
        }
    },
    actionButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '12px 20px',
        border: 'none',
        borderRadius: '25px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        fontSize: '0.95rem',
        color: '#666',
        background: '#f8f9fa',
        flex: 1,
        justifyContent: 'center',
        fontWeight: '500',
        ':hover': {
            transform: 'translateY(-2px)',
            background: '#f0f0f0'
        }
    },
    actionIcon: {
        fontSize: '1.1rem'
    },
    commentInputContainer: {
        marginTop: '20px',
        animation: 'slideDown 0.3s ease'
    },
    commentInput: {
        width: '100%',
        padding: '15px',
        border: '2px solid #eee',
        borderRadius: '15px',
        marginBottom: '15px',
        resize: 'vertical',
        minHeight: '100px',
        fontSize: '0.95rem',
        transition: 'all 0.3s ease',
        ':focus': {
            borderColor: '#3a86ff',
            boxShadow: '0 0 0 3px rgba(58, 134, 255, 0.1)'
        }
    },
    reviewInputContainer: {
        marginTop: '20px',
        padding: '15px',
        background: '#f8f9fa',
        borderRadius: '12px'
    },
    ratingContainer: {
        display: 'flex',
        gap: '5px',
        marginBottom: '15px'
    },
    starIcon: {
        fontSize: '1.5rem',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
    },
    reviewInput: {
        width: '100%',
        padding: '15px',
        border: '2px solid #eee',
        borderRadius: '15px',
        marginBottom: '15px',
        resize: 'vertical',
        minHeight: '100px',
        fontSize: '0.95rem',
        transition: 'all 0.3s ease',
        ':focus': {
            borderColor: '#3a86ff',
            boxShadow: '0 0 0 3px rgba(58, 134, 255, 0.1)'
        }
    },
    submitButton: {
        background: 'linear-gradient(45deg, #FF6B6B, #FFA500)',
        color: 'white',
        border: 'none',
        padding: '12px 25px',
        borderRadius: '25px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        fontSize: '1rem',
        fontWeight: '600',
        width: '100%',
        ':hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 5px 15px rgba(255, 107, 107, 0.3)'
        }
    }
};

export default DisplayChallengers;