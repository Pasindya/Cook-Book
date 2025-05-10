import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { 
    FaHeart, FaRegHeart, FaShareAlt, FaClock, 
    FaUtensils, FaEllipsisH, FaRegBookmark, 
    FaBookmark, FaFireAlt, FaLeaf, FaBreadSlice,
    FaComment, FaUser, FaStar, FaRegStar, 
    FaTrophy, FaCalendarAlt, FaUsers, FaSearch,
    FaFilter, FaSortAmountDown, FaChevronRight
} from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function AllChallengers() {
    const [challenges, setChallenges] = useState([]);
    const [upcomingChallenges, setUpcomingChallenges] = useState([]);
    const [activeChallenges, setActiveChallenges] = useState([]);
    const [pastChallenges, setPastChallenges] = useState([]);
    const [expandedChallenge, setExpandedChallenge] = useState(null);
    const [savedChallenges, setSavedChallenges] = useState([]);
    const [likedChallenges, setLikedChallenges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCommentInput, setShowCommentInput] = useState(null);
    const [showReviewInput, setShowReviewInput] = useState(null);
    const [newComment, setNewComment] = useState('');
    const [newReview, setNewReview] = useState({ rating: 0, text: '' });
    const [searchQuery, setSearchQuery] = useState('');
    const [sortOrder, setSortOrder] = useState('latest');
    const [showSortMenu, setShowSortMenu] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadChallenges();
        // Load saved challenges from localStorage if available
        const saved = JSON.parse(localStorage.getItem('savedChallenges')) || [];
        const liked = JSON.parse(localStorage.getItem('likedChallenges')) || [];
        setSavedChallenges(saved);
        setLikedChallenges(liked);
    }, []);
    
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
            
            const formattedChallenges = response.data.map(challenge => ({
                ...challenge,
                startDate: challenge.startDate || new Date().toISOString().split('T')[0],
                endDate: challenge.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                challengeImage: challenge.challengeImage || null
            }));
            
            setChallenges(formattedChallenges);
            categorizeChallenges(formattedChallenges);
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
            toast.info('Challenge unliked');
        } else {
            updatedLikedChallenges = [...likedChallenges, challengeId];
            toast.success('Challenge liked!');
        }
        setLikedChallenges(updatedLikedChallenges);
        localStorage.setItem('likedChallenges', JSON.stringify(updatedLikedChallenges));
    };

    const toggleCommentInput = (challengeId) => {
        setShowCommentInput(showCommentInput === challengeId ? null : challengeId);
        setNewComment('');
    };

    const toggleReviewInput = (challengeId) => {
        setShowReviewInput(showReviewInput === challengeId ? null : challengeId);
        setNewReview({ rating: 0, text: '' });
    };

    const handleCommentSubmit = async (challengeId) => {
        if (!newComment.trim()) {
            toast.warning('Please enter a comment');
            return;
        }

        try {
            await axios.post(`http://localhost:8080/api/challenges/${challengeId}/comments`, {
                text: newComment
            });
            toast.success('Comment added successfully');
            setNewComment('');
            setShowCommentInput(null);
            loadChallenges(); // Reload challenges to get updated comments
        } catch (error) {
            console.error('Error adding comment:', error);
            toast.error('Failed to add comment');
        }
    };

    const handleReviewSubmit = async (challengeId) => {
        if (!newReview.text.trim() || newReview.rating === 0) {
            toast.warning('Please provide both rating and review text');
            return;
        }

        try {
            await axios.post(`http://localhost:8080/api/challenges/${challengeId}/reviews`, newReview);
            toast.success('Review submitted successfully');
            setNewReview({ rating: 0, text: '' });
            setShowReviewInput(null);
            loadChallenges(); // Reload challenges to get updated reviews
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error('Failed to submit review');
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const getStatusBadge = (startDate, endDate) => {
        const today = new Date().toISOString().split('T')[0];
        
        if (startDate > today) {
            return <span style={styles.upcomingBadge}>Upcoming</span>;
        } else if (endDate < today) {
            return <span style={styles.pastBadge}>Completed</span>;
        } else {
            return <span style={styles.activeBadge}>Active</span>;
        }
    };

    const sortOptions = [
        { value: 'latest', label: 'Latest First', icon: <FaClock /> },
        { value: 'popular', label: 'Most Popular', icon: <FaHeart /> },
        { value: 'ending', label: 'Ending Soon', icon: <FaCalendarAlt /> }
    ];

    const handleSort = (value) => {
        setSortOrder(value);
        setShowSortMenu(false);
        // Sort challenges based on selected option
        const sortedChallenges = [...challenges].sort((a, b) => {
            switch (value) {
                case 'latest':
                    return new Date(b.startDate) - new Date(a.startDate);
                case 'popular':
                    return (b.likes || 0) - (a.likes || 0);
                case 'ending':
                    return new Date(a.endDate) - new Date(b.endDate);
                default:
                    return 0;
            }
        });
        setChallenges(sortedChallenges);
        categorizeChallenges(sortedChallenges);
    };

    const renderChallengeCard = (challenge) => (
        <div 
            key={challenge.id} 
            style={styles.challengeCard}
            className="challenge-card"
        >
            {/* Status Badge */}
            <div style={styles.statusBadge}>
                {getStatusBadge(challenge.startDate, challenge.endDate)}
            </div>
            
            {/* Challenge Image with Gradient Overlay */}
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
                <h3 style={styles.challengeTitle}>{challenge.ChallengeTitle}</h3>
                
                <div style={styles.dateContainer}>
                    <FaCalendarAlt style={styles.dateIcon} />
                    <span style={styles.dateText}>
                        {formatDate(challenge.startDate)} - {formatDate(challenge.endDate)}
                    </span>
                </div>
                
                <p style={styles.challengeDescription}>
                    {challenge.challengeDetails}
                </p>
                
                {/* Challenge Stats with Icons */}
                <div style={styles.statsContainer}>
                    <div style={styles.stat}>
                        <FaUsers style={styles.statIcon} /> 
                        <span>{challenge.participants || 0} Participants</span>
                    </div>
                    <div style={styles.stat}>
                        <FaHeart style={styles.statIcon} /> 
                        <span>{challenge.likes || 0} Likes</span>
                    </div>
                    <div style={styles.stat}>
                        <FaComment style={styles.statIcon} /> 
                        <span>{challenge.comments?.length || 0} Comments</span>
                    </div>
                </div>
                
                {/* Action Buttons with Hover Effects */}
                <div style={styles.actionButtons}>
                    <button 
                        onClick={() => toggleLike(challenge.id)}
                        style={{
                            ...styles.actionButton,
                            backgroundColor: likedChallenges.includes(challenge.id) ? 'rgba(255, 107, 107, 0.1)' : '#f8f9fa'
                        }}
                        className="action-button"
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
                        className="action-button"
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
                        className="action-button"
                    >
                        {savedChallenges.includes(challenge.id) ? 
                            <FaBookmark style={{ ...styles.actionIcon, color: '#3a86ff' }} /> : 
                            <FaRegBookmark style={styles.actionIcon} />
                        }
                        <span>Save</span>
                    </button>
                </div>
                
                {/* Comment Input with Animation */}
                {showCommentInput === challenge.id && (
                    <div style={styles.commentInputContainer} className="comment-input-container">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            style={styles.commentInput}
                        />
                        <button 
                            onClick={() => handleCommentSubmit(challenge.id)}
                            style={styles.submitButton}
                            className="submit-button"
                        >
                            Post Comment
                        </button>
                    </div>
                )}
            </div>
        </div>
    );

    const styles = {
        container: {
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '20px',
            backgroundColor: '#f8f9fa',
            minHeight: '100vh'
        },
        header: {
            textAlign: 'center',
            marginBottom: '40px',
            position: 'relative'
        },
        title: {
            fontSize: '2.8rem',
            color: '#333',
            marginBottom: '15px',
            background: 'linear-gradient(45deg, #FF6B6B, #FFA500)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold'
        },
        subtitle: {
            fontSize: '1.2rem',
            color: '#666',
            marginBottom: '30px'
        },
        searchAndSortContainer: {
            display: 'flex',
            gap: '20px',
            marginBottom: '30px',
            padding: '0 20px'
        },
        searchContainer: {
            flex: 1,
            position: 'relative'
        },
        searchInput: {
            width: '100%',
            padding: '12px 20px',
            paddingLeft: '45px',
            border: '2px solid #eee',
            borderRadius: '30px',
            fontSize: '1rem',
            transition: 'all 0.3s ease',
            backgroundColor: 'white',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        },
        searchIcon: {
            position: 'absolute',
            left: '15px',
            top: '50%',
            transform: 'translateY(-50%)',
            color: '#666',
            fontSize: '1.1rem'
        },
        sortContainer: {
            position: 'relative'
        },
        sortButton: {
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 20px',
            border: '2px solid #eee',
            borderRadius: '30px',
            backgroundColor: 'white',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
        },
        sortMenu: {
            position: 'absolute',
            top: '100%',
            right: 0,
            width: '200px',
            backgroundColor: 'white',
            borderRadius: '15px',
            boxShadow: '0 5px 20px rgba(0,0,0,0.1)',
            marginTop: '10px',
            zIndex: 100,
            overflow: 'hidden'
        },
        sortOption: {
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 20px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            ':hover': {
                backgroundColor: '#f8f9fa'
            }
        },
        sectionTitle: {
            fontSize: '2rem',
            color: '#333',
            marginBottom: '25px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '0 20px'
        },
        challengeCard: {
            background: '#fff',
            borderRadius: '20px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            marginBottom: '30px',
            position: 'relative',
            transform: 'translateY(0)',
            ':hover': {
                transform: 'translateY(-5px)',
                boxShadow: '0 15px 35px rgba(0,0,0,0.12)'
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
        challengeTitle: {
            fontSize: '1.5rem',
            color: '#333',
            marginBottom: '15px',
            fontWeight: '600',
            lineHeight: '1.3'
        },
        dateContainer: {
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '15px',
            color: '#666'
        },
        dateIcon: {
            color: '#3a86ff',
            fontSize: '1.1rem'
        },
        dateText: {
            fontSize: '0.95rem'
        },
        challengeDescription: {
            color: '#555',
            lineHeight: '1.6',
            marginBottom: '20px',
            fontSize: '1rem'
        },
        statsContainer: {
            display: 'flex',
            gap: '25px',
            marginBottom: '25px',
            padding: '15px 0',
            borderTop: '1px solid #eee',
            borderBottom: '1px solid #eee'
        },
        stat: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#666',
            fontSize: '0.95rem'
        },
        statIcon: {
            color: '#FF6B6B',
            fontSize: '1.1rem'
        },
        actionButtons: {
            display: 'flex',
            gap: '15px',
            marginBottom: '20px'
        },
        actionButton: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '25px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontSize: '0.95rem',
            color: '#666',
            flex: 1,
            justifyContent: 'center'
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
        },
        statusBadge: {
            position: 'absolute',
            top: '20px',
            right: '20px',
            zIndex: '2'
        },
        upcomingBadge: {
            background: 'rgba(25, 118, 210, 0.1)',
            color: '#1976d2',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: '600',
            backdropFilter: 'blur(5px)'
        },
        activeBadge: {
            background: 'rgba(46, 125, 50, 0.1)',
            color: '#2e7d32',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: '600',
            backdropFilter: 'blur(5px)'
        },
        pastBadge: {
            background: 'rgba(97, 97, 97, 0.1)',
            color: '#616161',
            padding: '8px 16px',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: '600',
            backdropFilter: 'blur(5px)'
        },
        loadingContainer: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '200px'
        },
        loadingSpinner: {
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #FF6B6B',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            animation: 'spin 1s linear infinite'
        }
    };

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.loadingSpinner}></div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div style={styles.container}>
                <div style={styles.header}>
                    <h1 style={styles.title}>All Challenges</h1>
                    <p style={styles.subtitle}>Discover and participate in exciting cooking challenges</p>
                    
                    {/* Search and Sort Container */}
                    <div style={styles.searchAndSortContainer}>
                        <div style={styles.searchContainer}>
                            <FaSearch style={styles.searchIcon} />
                            <input
                                type="text"
                                placeholder="Search challenges..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={styles.searchInput}
                            />
                        </div>
                        
                        <div style={styles.sortContainer}>
                            <button 
                                style={styles.sortButton}
                                onClick={() => setShowSortMenu(!showSortMenu)}
                            >
                                <FaSortAmountDown />
                                <span>Sort by</span>
                                <FaChevronRight style={{ 
                                    transform: showSortMenu ? 'rotate(90deg)' : 'none',
                                    transition: 'transform 0.3s ease'
                                }} />
                            </button>
                            
                            {showSortMenu && (
                                <div style={styles.sortMenu}>
                                    {sortOptions.map(option => (
                                        <div
                                            key={option.value}
                                            style={styles.sortOption}
                                            onClick={() => handleSort(option.value)}
                                        >
                                            {option.icon}
                                            <span>{option.label}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Active Challenges */}
                {activeChallenges.length > 0 && (
                    <div>
                        <h2 style={styles.sectionTitle}>
                            <FaFireAlt style={{ color: '#ff6b6b' }} />
                            Active Challenges
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '30px', padding: '0 20px' }}>
                            {activeChallenges.map(challenge => renderChallengeCard(challenge))}
                        </div>
                    </div>
                )}

                {/* Upcoming Challenges */}
                {upcomingChallenges.length > 0 && (
                    <div style={{ marginTop: '40px' }}>
                        <h2 style={styles.sectionTitle}>
                            <FaClock style={{ color: '#3a86ff' }} />
                            Upcoming Challenges
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '30px', padding: '0 20px' }}>
                            {upcomingChallenges.map(challenge => renderChallengeCard(challenge))}
                        </div>
                    </div>
                )}

                {/* Past Challenges */}
                {pastChallenges.length > 0 && (
                    <div style={{ marginTop: '40px' }}>
                        <h2 style={styles.sectionTitle}>
                            <FaTrophy style={{ color: '#FFA500' }} />
                            Past Challenges
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '30px', padding: '0 20px' }}>
                            {pastChallenges.map(challenge => renderChallengeCard(challenge))}
                        </div>
                    </div>
                )}

                {challenges.length === 0 && !loading && (
                    <div style={{
                        textAlign: 'center',
                        padding: '60px 40px',
                        background: '#fff',
                        borderRadius: '20px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                        margin: '40px 20px'
                    }}>
                        <FaTrophy style={{ fontSize: '4rem', color: '#FFA500', marginBottom: '25px' }} />
                        <h2 style={{ color: '#333', marginBottom: '15px', fontSize: '1.8rem' }}>No Challenges Found</h2>
                        <p style={{ color: '#666', marginBottom: '20px', fontSize: '1.1rem' }}>
                            There are no cooking challenges available right now. Check back later!
                        </p>
                    </div>
                )}
            </div>
            <ToastContainer />
            
            <style>
                {`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                    
                    @keyframes slideDown {
                        from { opacity: 0; transform: translateY(-10px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    
                    .challenge-card:hover {
                        transform: translateY(-5px);
                        box-shadow: 0 15px 35px rgba(0,0,0,0.12);
                    }
                    
                    .challenge-card:hover .challengeImage {
                        transform: scale(1.05);
                    }
                    
                    .action-button:hover {
                        background-color: #f0f0f0;
                        transform: translateY(-2px);
                    }
                    
                    .submit-button:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 5px 15px rgba(255, 107, 107, 0.3);
                    }
                    
                    .comment-input-container {
                        animation: slideDown 0.3s ease;
                    }
                `}
            </style>
        </div>
    );
}

export default AllChallengers; 