import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { 
    FaHeart, FaRegHeart, FaShareAlt, FaClock, 
    FaUtensils, FaEllipsisH, FaRegBookmark, 
    FaBookmark, FaFireAlt, FaLeaf, FaBreadSlice,
    FaEdit, FaTrash, FaComment, FaUser,
    FaStar, FaRegStar, FaTrophy, FaCalendarAlt,
    FaSearch, FaFilter, FaUsers, FaAward, FaChevronRight
} from 'react-icons/fa';
import { GiMeal, GiFruitBowl, GiChickenOven } from 'react-icons/gi';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AllChallengers() {
    const [challenges, setChallenges] = useState([]);
    const [filteredChallenges, setFilteredChallenges] = useState([]);
    const [upcomingChallenges, setUpcomingChallenges] = useState([]);
    const [activeChallenges, setActiveChallenges] = useState([]);
    const [pastChallenges, setPastChallenges] = useState([]);
    const [expandedChallenges, setExpandedChallenges] = useState({});
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
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [selectedChallenge, setSelectedChallenge] = useState(null);
    const [joinFormData, setJoinFormData] = useState({
        name: '',
        email: '',
        reason: ''
    });
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
                ChallengeTitle: challenge.ChallengeTitle || challenge.challengeTitle,
                startDate: challenge.startDate || new Date().toISOString().split('T')[0],
                endDate: challenge.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                challengeImage: challenge.challengeImage || null,
                challengeDetails: challenge.challengeDetails || challenge.ChallengeDetails || 'No details provided',
                rules: challenge.Rules || challenge.rules || 'No rules specified',
                likes: challenge.likes || 0,
                participants: challenge.participants || []
            }));
            
            setChallenges(formattedChallenges);
            setFilteredChallenges(formattedChallenges);
            
            // Categorize challenges
            const today = new Date().toISOString().split('T')[0];
            const upcoming = formattedChallenges.filter(challenge => challenge.startDate > today);
            const active = formattedChallenges.filter(challenge => 
                challenge.startDate <= today && challenge.endDate >= today
            );
            const past = formattedChallenges.filter(challenge => challenge.endDate < today);
            
            setUpcomingChallenges(upcoming);
            setActiveChallenges(active);
            setPastChallenges(past);
            
            // Load participants for each challenge
            loadParticipants(formattedChallenges);
            setLoading(false);
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
        setExpandedChallenges(prev => ({
            ...prev,
            [challengeId]: !prev[challengeId]
        }));
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
        setShowParticipants(showParticipants === challenge.id ? null : challenge.id);
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

    const shareChallenge = (challenge) => {
        const shareUrl = `${window.location.origin}/challenge/${challenge.id}`;
        navigator.clipboard.writeText(shareUrl)
            .then(() => toast.success('Challenge link copied to clipboard!'))
            .catch(() => toast.error('Failed to copy link'));
    };

    const handleUpdate = (challengeId) => {
        navigate(`/updatechallenge/${challengeId}`);
    };
    
    const handleJoinClick = (challenge) => {
        setSelectedChallenge(challenge);
        setShowJoinModal(true);
    };

    const handleJoinSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:8080/api/challenges/${selectedChallenge.id}/join`, joinFormData);
            toast.success('Successfully joined the challenge!');
            setShowJoinModal(false);
            setJoinFormData({ name: '', email: '', reason: '' });
            // Reload participants for this challenge
            const response = await axios.get(`http://localhost:8080/api/challenges/${selectedChallenge.id}/participants`);
            setParticipants(prev => ({
                ...prev,
                [selectedChallenge.id]: response.data
            }));
        } catch (error) {
            console.error("Error joining challenge:", error);
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
                            expandedChallenges={expandedChallenges}
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
                            handleJoinClick={handleJoinClick}
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
                                transition: 'all 0.3s ease'
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
                                transition: 'all 0.2s ease'
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
                                transition: 'all 0.2s ease'
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
                                transition: 'all 0.2s ease'
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
                                transition: 'all 0.2s ease'
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
                                transition: 'all 0.2s ease'
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
                            boxShadow: '0 4px 15px rgba(255,107,107,0.3)'
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
                                marginRight: '10px'
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
                                transition: 'all 0.3s ease'
                            }}
                        >
                            Create a Challenge
                        </button>
                    </div>
                )}
                
                {/* Join Challenge Modal */}
                {showJoinModal && selectedChallenge && (
                    <div style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 1000
                    }}>
                        <div style={{
                            background: 'white',
                            borderRadius: '20px',
                            padding: '30px',
                            width: '90%',
                            maxWidth: '600px',
                            maxHeight: '90vh',
                            overflowY: 'auto',
                            position: 'relative',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                        }}>
                            {/* Close Button */}
                            <button
                                onClick={() => setShowJoinModal(false)}
                                style={{
                                    position: 'absolute',
                                    top: '20px',
                                    right: '20px',
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '1.5rem',
                                    cursor: 'pointer',
                                    color: '#666'
                                }}
                            >
                                ×
                            </button>

                            {/* Challenge Details */}
                            <div style={{ marginBottom: '30px' }}>
                                <h2 style={{
                                    fontSize: '1.8rem',
                                    color: '#333',
                                    marginBottom: '15px',
                                    fontWeight: '600'
                                }}>
                                    Join Challenge: {selectedChallenge.ChallengeTitle}
                                </h2>
                                
                                <div style={{
                                    display: 'flex',
                                    gap: '20px',
                                    marginBottom: '20px'
                                }}>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{
                                            fontSize: '1.1rem',
                                            color: '#666',
                                            marginBottom: '10px'
                                        }}>Challenge Details</h3>
                                        <p style={{
                                            fontSize: '0.95rem',
                                            color: '#444',
                                            lineHeight: '1.6'
                                        }}>
                                            {selectedChallenge.challengeDetails}
                                        </p>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{
                                            fontSize: '1.1rem',
                                            color: '#666',
                                            marginBottom: '10px'
                                        }}>Rules</h3>
                                        <p style={{
                                            fontSize: '0.95rem',
                                            color: '#444',
                                            lineHeight: '1.6'
                                        }}>
                                            {selectedChallenge.rules}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Join Form */}
                            <form onSubmit={handleJoinSubmit}>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        color: '#333',
                                        fontSize: '0.95rem',
                                        fontWeight: '500'
                                    }}>
                                        Your Name
                                    </label>
                                    <input
                                        type="text"
                                        value={joinFormData.name}
                                        onChange={(e) => setJoinFormData(prev => ({ ...prev, name: e.target.value }))}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            borderRadius: '8px',
                                            border: '1px solid #ddd',
                                            fontSize: '0.95rem'
                                        }}
                                        placeholder="Enter your name"
                                    />
                                </div>

                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        color: '#333',
                                        fontSize: '0.95rem',
                                        fontWeight: '500'
                                    }}>
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        value={joinFormData.email}
                                        onChange={(e) => setJoinFormData(prev => ({ ...prev, email: e.target.value }))}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            borderRadius: '8px',
                                            border: '1px solid #ddd',
                                            fontSize: '0.95rem'
                                        }}
                                        placeholder="Enter your email"
                                    />
                                </div>

                                <div style={{ marginBottom: '30px' }}>
                                    <label style={{
                                        display: 'block',
                                        marginBottom: '8px',
                                        color: '#333',
                                        fontSize: '0.95rem',
                                        fontWeight: '500'
                                    }}>
                                        Why do you want to join this challenge?
                                    </label>
                                    <textarea
                                        value={joinFormData.reason}
                                        onChange={(e) => setJoinFormData(prev => ({ ...prev, reason: e.target.value }))}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '12px',
                                            borderRadius: '8px',
                                            border: '1px solid #ddd',
                                            fontSize: '0.95rem',
                                            minHeight: '100px',
                                            resize: 'vertical'
                                        }}
                                        placeholder="Tell us why you want to join this challenge..."
                                    />
                                </div>

                                <div style={{
                                    display: 'flex',
                                    gap: '15px',
                                    justifyContent: 'flex-end'
                                }}>
                                    <button
                                        type="button"
                                        onClick={() => setShowJoinModal(false)}
                                        style={{
                                            padding: '12px 25px',
                                            borderRadius: '8px',
                                            border: '1px solid #ddd',
                                            background: 'white',
                                            color: '#666',
                                            fontSize: '0.95rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        style={{
                                            padding: '12px 25px',
                                            borderRadius: '8px',
                                            border: 'none',
                                            background: 'linear-gradient(45deg, #3a86ff, #4CAF50)',
                                            color: 'white',
                                            fontSize: '0.95rem',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease',
                                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                                        }}
                                    >
                                        Join Challenge
                                    </button>
                                </div>
                            </form>
                        </div>
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
    expandedChallenges,
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
    handleJoinClick
}) => {
    const isParticipant = participants?.some(p => p.id === 'current-user-id'); // Replace with actual user ID check

    return (
        <div 
            style={{
                background: '#fff',
                borderRadius: '20px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                position: 'relative'
            }}
            className="challenge-card"
        >
            {/* Status Badge */}
            <div style={{
                position: 'absolute',
                top: '20px',
                right: '20px',
                zIndex: '2',
                display: 'flex',
                gap: '10px'
            }}>
                {getStatusBadge(challenge.startDate, challenge.endDate)}
                
                {/* Three-dot Menu Button */}
                <div style={{ position: 'relative' }}>
                    <button
                        onClick={(e) => toggleMenu(challenge.id, e)}
                        style={{
                            background: 'rgba(255, 255, 255, 0.9)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '32px',
                            height: '32px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <FaEllipsisH style={{ color: '#666' }} />
                    </button>

                    {/* Dropdown Menu */}
                    {showMenu === challenge.id && (
                        <div style={{
                            position: 'absolute',
                            top: '40px',
                            right: '0',
                            background: 'white',
                            borderRadius: '12px',
                            boxShadow: '0 5px 15px rgba(0,0,0,0.1)',
                            padding: '8px 0',
                            minWidth: '180px',
                            zIndex: '1000',
                            animation: 'slideIn 0.2s ease'
                        }}>
                            <button
                                onClick={() => {
                                    handleUpdate(challenge.id);
                                    setShowMenu(null);
                                }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '12px 16px',
                                    width: '100%',
                                    border: 'none',
                                    background: 'transparent',
                                    cursor: 'pointer',
                                    color: '#333',
                                    fontSize: '0.95rem',
                                    transition: 'all 0.2s ease',
                                    ':hover': {
                                        background: '#f8f9fa'
                                    }
                                }}
                            >
                                <FaEdit style={{ color: '#4CAF50' }} />
                                <span>Edit Challenge</span>
                            </button>
                            
                            <button
                                onClick={() => {
                                    handleDelete(challenge.id);
                                    setShowMenu(null);
                                }}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    padding: '12px 16px',
                                    width: '100%',
                                    border: 'none',
                                    background: 'transparent',
                                    cursor: 'pointer',
                                    color: '#333',
                                    fontSize: '0.95rem',
                                    transition: 'all 0.2s ease',
                                    ':hover': {
                                        background: '#f8f9fa'
                                    }
                                }}
                            >
                                <FaTrash style={{ color: '#ff6b6b' }} />
                                <span>Delete Challenge</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Challenge Image */}
            <div style={{
                width: '100%',
                height: '280px',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {challenge.challengeImage ? (
                    <div style={{
                        width: '100%',
                        height: '100%',
                        position: 'relative'
                    }}>
                        <img 
                            src={`http://localhost:8080/api/challenges/images/${challenge.challengeImage}`}
                            alt={challenge.ChallengeTitle}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                transition: 'transform 0.3s ease'
                            }}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/400x250?text=Challenge+Image';
                            }}
                        />
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.3))'
                        }} />
                    </div>
                ) : (
                    <div style={{
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(45deg, #FF6B6B, #FFA500)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <FaTrophy style={{
                            color: 'white',
                            fontSize: '4rem',
                            opacity: 0.8
                        }} />
                    </div>
                )}
            </div>
            
            {/* Challenge Content */}
            <div style={{
                padding: '25px'
            }}>
                {/* Title Section */}
                <div style={{
                    marginBottom: '20px',
                    paddingBottom: '15px',
                    borderBottom: '1px solid #eee'
                }}>
                    <h3 style={{
                        fontSize: '1.8rem',
                        color: '#333',
                        marginBottom: '12px',
                        fontWeight: '700',
                        lineHeight: '1.3',
                        letterSpacing: '-0.5px'
                    }}>
                        {challenge.ChallengeTitle}
                    </h3>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        color: '#666'
                    }}>
                        <FaCalendarAlt style={{
                            color: '#3a86ff',
                            fontSize: '1.1rem'
                        }} />
                        <span style={{
                            fontSize: '0.95rem',
                            fontWeight: '500'
                        }}>
                            {formatDate(challenge.startDate)} - {formatDate(challenge.endDate)}
                        </span>
                    </div>
                </div>

                {/* Show More Button */}
                <button 
                    onClick={() => toggleExpand(challenge.id)}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '10px 20px',
                        border: 'none',
                        borderRadius: '25px',
                        backgroundColor: '#f8f9fa',
                        color: '#666',
                        cursor: 'pointer',
                        fontSize: '0.95rem',
                        fontWeight: '500',
                        marginBottom: '20px',
                        transition: 'all 0.3s ease',
                        width: '100%',
                        justifyContent: 'center'
                    }}
                >
                    {expandedChallenges[challenge.id] ? 'Show Less' : 'Show More'}
                    <FaChevronRight style={{ 
                        transform: expandedChallenges[challenge.id] ? 'rotate(90deg)' : 'none',
                        transition: 'transform 0.3s ease'
                    }} />
                </button>

                {/* Challenge Details and Rules (Collapsible) */}
                {expandedChallenges[challenge.id] && (
                    <>
                        {/* Challenge Details */}
                        <div style={{
                            marginBottom: '20px',
                            padding: '20px',
                            background: '#f8f9fa',
                            borderRadius: '12px',
                            border: '1px solid #e9ecef'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                marginBottom: '15px',
                                paddingBottom: '10px',
                                borderBottom: '2px solid #e9ecef'
                            }}>
                                <FaUtensils style={{
                                    fontSize: '1.2rem',
                                    color: '#ff6b6b'
                                }} />
                                <span style={{
                                    fontSize: '1.1rem',
                                    fontWeight: '600',
                                    color: '#333'
                                }}>Challenge Details</span>
                            </div>
                            <div style={{
                                padding: '10px 0'
                            }}>
                                <p style={{
                                    fontSize: '0.95rem',
                                    lineHeight: '1.6',
                                    color: '#444',
                                    margin: 0,
                                    whiteSpace: 'pre-wrap'
                                }}>
                                    {challenge.challengeDetails}
                                </p>
                            </div>
                        </div>

                        {/* Rules Section */}
                        <div style={{
                            marginBottom: '20px',
                            padding: '20px',
                            background: '#fff8f8',
                            borderRadius: '12px',
                            border: '1px solid #ffe0e0'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                marginBottom: '15px',
                                paddingBottom: '10px',
                                borderBottom: '2px solid #ffe0e0'
                            }}>
                                <FaLeaf style={{
                                    fontSize: '1.2rem',
                                    color: '#ff6b6b'
                                }} />
                                <span style={{
                                    fontSize: '1.1rem',
                                    fontWeight: '600',
                                    color: '#333'
                                }}>Rules & Guidelines</span>
                            </div>
                            <div style={{
                                padding: '10px 0'
                            }}>
                                <p style={{
                                    fontSize: '0.95rem',
                                    lineHeight: '1.6',
                                    color: '#444',
                                    margin: 0,
                                    whiteSpace: 'pre-wrap'
                                }}>
                                    {challenge.rules}
                                </p>
                            </div>
                        </div>
                    </>
                )}
                
                {/* Challenge Stats */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    gap: '15px',
                    marginBottom: '25px',
                    padding: '15px',
                    background: '#f8f9fa',
                    borderRadius: '12px'
                }}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        flex: 1
                    }}>
                        <FaUsers style={{
                            color: '#FF6B6B',
                            fontSize: '1.3rem'
                        }} /> 
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <span style={{
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                color: '#333'
                            }}>{participants?.length || 0}</span>
                            <span style={{
                                fontSize: '0.85rem',
                                color: '#666'
                            }}>Participants</span>
                        </div>
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        flex: 1
                    }}>
                        <FaHeart style={{
                            color: '#FF6B6B',
                            fontSize: '1.3rem'
                        }} /> 
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <span style={{
                                fontSize: '1.1rem',
                                fontWeight: '600',
                                color: '#333'
                            }}>{challenge.likes || 0}</span>
                            <span style={{
                                fontSize: '0.85rem',
                                color: '#666'
                            }}>Likes</span>
                        </div>
                    </div>
                </div>
                
                {/* Action Buttons */}
                <div style={{
                    display: 'flex',
                    gap: '12px',
                    marginBottom: '20px'
                }}>
                    <button 
                        onClick={() => toggleLike(challenge.id)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 20px',
                            border: 'none',
                            borderRadius: '25px',
                            cursor: 'pointer',
                            fontSize: '0.95rem',
                            color: '#666',
                            flex: 1,
                            justifyContent: 'center',
                            fontWeight: '500',
                            backgroundColor: likedChallenges.includes(challenge.id) ? 'rgba(255, 107, 107, 0.1)' : '#f8f9fa',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {likedChallenges.includes(challenge.id) ? 
                            <FaHeart style={{ color: '#ff6b6b' }} /> : 
                            <FaRegHeart />
                        }
                        <span>Like</span>
                    </button>
                    
                    <button 
                        onClick={() => handleJoinClick(challenge)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 20px',
                            border: 'none',
                            borderRadius: '25px',
                            cursor: 'pointer',
                            fontSize: '0.95rem',
                            color: '#fff',
                            flex: 1,
                            justifyContent: 'center',
                            fontWeight: '500',
                            backgroundColor: isParticipant ? '#4CAF50' : '#3a86ff',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                        }}
                        disabled={isParticipant}
                    >
                        <FaUsers />
                        <span>{isParticipant ? 'Joined' : 'Join Challenge'}</span>
                    </button>
                    
                    <button 
                        onClick={() => toggleSave(challenge.id)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 20px',
                            border: 'none',
                            borderRadius: '25px',
                            cursor: 'pointer',
                            fontSize: '0.95rem',
                            color: '#666',
                            flex: 1,
                            justifyContent: 'center',
                            fontWeight: '500',
                            backgroundColor: savedChallenges.includes(challenge.id) ? 'rgba(58, 134, 255, 0.1)' : '#f8f9fa',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {savedChallenges.includes(challenge.id) ? 
                            <FaBookmark style={{ color: '#3a86ff' }} /> : 
                            <FaRegBookmark />
                        }
                        <span>Save</span>
                    </button>
                </div>

                {/* Participants Section */}
                {expandedChallenges[challenge.id] && (
                    <div style={{
                        marginTop: '20px',
                        padding: '15px',
                        background: '#f8f9fa',
                        borderRadius: '12px',
                        border: '1px solid #e9ecef'
                    }}>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '15px'
                        }}>
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                <FaUsers style={{ color: '#3a86ff' }} />
                                <span style={{
                                    fontSize: '1.1rem',
                                    fontWeight: '600',
                                    color: '#333'
                                }}>Participants</span>
                            </div>
                            <span style={{
                                fontSize: '0.9rem',
                                color: '#666',
                                backgroundColor: '#fff',
                                padding: '5px 10px',
                                borderRadius: '15px',
                                border: '1px solid #e9ecef'
                            }}>
                                {participants?.length || 0} joined
                            </span>
                        </div>
                        
                        {participants && participants.length > 0 ? (
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px'
                            }}>
                                {participants.slice(0, 3).map((participant, index) => (
                                    <div key={index} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        padding: '10px',
                                        background: '#fff',
                                        borderRadius: '8px',
                                        boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                                    }}>
                                        <div style={{
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '50%',
                                            background: '#e9ecef',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <FaUser style={{ color: '#666' }} />
                                        </div>
                                        <span style={{
                                            fontSize: '0.95rem',
                                            color: '#333',
                                            fontWeight: '500'
                                        }}>
                                            {participant.username || 'Anonymous User'}
                                        </span>
                                    </div>
                                ))}
                                
                                {participants.length > 3 && (
                                    <button
                                        onClick={() => toggleParticipants(challenge.id)}
                                        style={{
                                            background: 'none',
                                            border: 'none',
                                            color: '#3a86ff',
                                            fontSize: '0.9rem',
                                            cursor: 'pointer',
                                            padding: '5px 0',
                                            textAlign: 'center',
                                            width: '100%'
                                        }}
                                    >
                                        {showParticipants === challenge.id ? 'Show Less' : `Show ${participants.length - 3} more`}
                                    </button>
                                )}
                                
                                {showParticipants === challenge.id && (
                                    <div style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '10px',
                                        marginTop: '10px'
                                    }}>
                                        {participants.slice(3).map((participant, index) => (
                                            <div key={index} style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px',
                                                padding: '10px',
                                                background: '#fff',
                                                borderRadius: '8px',
                                                boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                                            }}>
                                                <div style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    borderRadius: '50%',
                                                    background: '#e9ecef',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center'
                                                }}>
                                                    <FaUser style={{ color: '#666' }} />
                                                </div>
                                                <span style={{
                                                    fontSize: '0.95rem',
                                                    color: '#333',
                                                    fontWeight: '500'
                                                }}>
                                                    {participant.username || 'Anonymous User'}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div style={{
                                textAlign: 'center',
                                padding: '20px',
                                color: '#666',
                                fontSize: '0.95rem'
                            }}>
                                No participants yet. Be the first to join!
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AllChallengers; 