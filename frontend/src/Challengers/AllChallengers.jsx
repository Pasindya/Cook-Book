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
    const [showFullDetails, setShowFullDetails] = useState({});
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
                ChallengeTitle: challenge.ChallengeTitle || challenge.challengeTitle,
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

    const toggleFullDetails = (challengeId) => {
        setShowFullDetails(prev => ({
            ...prev,
            [challengeId]: !prev[challengeId]
        }));
    };

    const renderChallengeCard = (challenge) => (
        <div 
            key={challenge.id} 
            style={styles.feedCard}
            className="feed-card"
        >
            {/* Challenge Header */}
            <div style={styles.cardHeader}>
                <div style={styles.userInfo}>
                    <div style={styles.avatarContainer}>
                        <FaTrophy style={styles.avatarIcon} />
                    </div>
                    <div style={styles.userDetails}>
                        <h2 style={styles.challengeTitle}>
                            {challenge.ChallengeTitle || challenge.challengeTitle || 'Untitled Challenge'}
                        </h2>
                        <div style={styles.challengeMeta}>
                            <span style={styles.dateText}>
                                <FaCalendarAlt style={styles.metaIcon} />
                                {formatDate(challenge.startDate)} - {formatDate(challenge.endDate)}
                            </span>
                            {getStatusBadge(challenge.startDate, challenge.endDate)}
                        </div>
                    </div>
                </div>
                <div style={styles.headerActions}>
                    <button 
                        onClick={() => toggleSave(challenge.id)}
                        style={styles.iconButton}
                        title="Save Challenge"
                    >
                        {savedChallenges.includes(challenge.id) ? 
                            <FaBookmark style={{ color: '#3a86ff' }} /> : 
                            <FaRegBookmark />
                        }
                    </button>
                </div>
            </div>

            {/* Challenge Image */}
            <div 
                style={styles.imageContainer}
                onClick={() => navigate(`/challenge/${challenge.id}`)}
            >
                {challenge.challengeImage ? (
                    <img 
                        src={`http://localhost:8080/api/challenges/images/${challenge.challengeImage}`}
                        alt={challenge.ChallengeTitle}
                        style={styles.challengeImage}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/800x400?text=Challenge+Image';
                        }}
                    />
                ) : (
                    <div style={styles.placeholderImage}>
                        <FaTrophy style={styles.placeholderIcon} />
                    </div>
                )}
            </div>

            {/* Challenge Content */}
            <div style={styles.cardContent}>
                {/* Challenge Description with Full Details */}
                <div style={styles.descriptionContainer}>
                    <div style={styles.detailsHeader}>
                        <FaUtensils style={styles.detailsIcon} />
                        <span style={styles.detailsTitle}>Challenge Details</span>
                    </div>
                    <div style={styles.descriptionText}>
                        {showFullDetails[challenge.id] ? (
                            <>
                                <p style={styles.challengeDescription}>
                                    {challenge.challengeDetails}
                                </p>
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
                            </>
                        ) : (
                            <p style={styles.challengeDescription}>
                                {challenge.challengeDetails?.substring(0, 150)}
                                {challenge.challengeDetails?.length > 150 ? '...' : ''}
                            </p>
                        )}
                    </div>
                    {challenge.challengeDetails?.length > 150 && (
                        <button 
                            onClick={() => toggleFullDetails(challenge.id)}
                            style={styles.readMoreButton}
                        >
                            {showFullDetails[challenge.id] ? 'Show Less' : 'Read More'}
                            <FaChevronRight style={{ 
                                fontSize: '0.8rem', 
                                marginLeft: '5px',
                                transform: showFullDetails[challenge.id] ? 'rotate(90deg)' : 'none',
                                transition: 'transform 0.3s ease'
                            }} />
                        </button>
                    )}
                </div>

                {/* Challenge Stats */}
                <div style={styles.statsContainer}>
                    <div style={styles.statItem}>
                        <FaUsers style={styles.statIcon} />
                        <span>{challenge.participants || 0} participants</span>
                    </div>
                    <div style={styles.statItem}>
                        <FaHeart style={styles.statIcon} />
                        <span>{challenge.likes || 0} likes</span>
                    </div>
                    <div style={styles.statItem}>
                        <FaComment style={styles.statIcon} />
                        <span>{challenge.comments?.length || 0} comments</span>
                    </div>
                </div>

                {/* Action Buttons */}
                <div style={styles.actionButtons}>
                    <button 
                        onClick={() => toggleLike(challenge.id)}
                        style={{
                            ...styles.actionButton,
                            color: likedChallenges.includes(challenge.id) ? '#ff6b6b' : '#666'
                        }}
                    >
                        {likedChallenges.includes(challenge.id) ? 
                            <FaHeart style={styles.actionIcon} /> : 
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
                        onClick={() => navigate(`/challenge/${challenge.id}`)}
                        style={styles.viewDetailsButton}
                    >
                        View Full Details
                        <FaChevronRight style={{ fontSize: '0.8rem', marginLeft: '5px' }} />
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

                {/* Comments Section */}
                {challenge.comments && challenge.comments.length > 0 && (
                    <div style={styles.commentsSection}>
                        {challenge.comments.slice(0, 2).map((comment, index) => (
                            <div key={index} style={styles.commentItem}>
                                <div style={styles.commentHeader}>
                                    <FaUser style={styles.commentAvatar} />
                                    <span style={styles.commentAuthor}>User {comment.userId}</span>
                                </div>
                                <p style={styles.commentText}>{comment.text}</p>
                            </div>
                        ))}
                        {challenge.comments.length > 2 && (
                            <button 
                                onClick={() => navigate(`/challenge/${challenge.id}`)}
                                style={styles.viewAllComments}
                            >
                                View all {challenge.comments.length} comments
                            </button>
                        )}
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
        feedContainer: {
            maxWidth: '800px',
            margin: '0 auto',
            padding: '20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '40px'
        },
        feedSection: {
            display: 'flex',
            flexDirection: 'column',
            gap: '30px'
        },
        feedCard: {
            background: '#fff',
            borderRadius: '15px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            overflow: 'hidden',
            transition: 'all 0.3s ease'
        },
        cardHeader: {
            padding: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            borderBottom: '1px solid #eee'
        },
        userInfo: {
            display: 'flex',
            gap: '15px',
            alignItems: 'flex-start'
        },
        avatarContainer: {
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #FF6B6B, #FFA500)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        avatarIcon: {
            color: 'white',
            fontSize: '1.5rem'
        },
        userDetails: {
            display: 'flex',
            flexDirection: 'column',
            gap: '5px'
        },
        challengeTitle: {
            fontSize: '1.8rem',
            fontWeight: '700',
            color: '#333',
            margin: '0 0 8px 0',
            lineHeight: '1.3',
            letterSpacing: '-0.5px'
        },
        challengeMeta: {
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            color: '#666',
            fontSize: '0.9rem'
        },
        metaIcon: {
            color: '#3a86ff',
            fontSize: '0.9rem'
        },
        headerActions: {
            display: 'flex',
            gap: '10px'
        },
        iconButton: {
            background: 'none',
            border: 'none',
            padding: '8px',
            cursor: 'pointer',
            color: '#666',
            transition: 'all 0.2s ease',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        },
        imageContainer: {
            width: '100%',
            height: '400px',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'pointer'
        },
        challengeImage: {
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.3s ease'
        },
        cardContent: {
            padding: '20px'
        },
        descriptionContainer: {
            marginBottom: '20px',
            background: '#f8f9fa',
            borderRadius: '12px',
            padding: '20px'
        },
        detailsHeader: {
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '15px'
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
        descriptionText: {
            marginBottom: '15px'
        },
        challengeDescription: {
            color: '#555',
            fontSize: '1rem',
            lineHeight: '1.6',
            marginBottom: '15px',
            whiteSpace: 'pre-wrap'
        },
        rulesSection: {
            marginTop: '20px',
            paddingTop: '20px',
            borderTop: '1px solid #eee'
        },
        rulesText: {
            color: '#666',
            fontSize: '0.95rem',
            lineHeight: '1.6',
            whiteSpace: 'pre-wrap'
        },
        readMoreButton: {
            display: 'flex',
            alignItems: 'center',
            background: 'none',
            border: 'none',
            color: '#3a86ff',
            cursor: 'pointer',
            padding: '8px 0',
            fontSize: '0.95rem',
            fontWeight: '500',
            transition: 'all 0.2s ease'
        },
        statsContainer: {
            display: 'flex',
            gap: '20px',
            padding: '15px 0',
            borderTop: '1px solid #eee',
            borderBottom: '1px solid #eee',
            marginBottom: '20px'
        },
        statItem: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#666',
            fontSize: '0.9rem'
        },
        statIcon: {
            color: '#ff6b6b',
            fontSize: '1.1rem'
        },
        actionButtons: {
            display: 'flex',
            gap: '10px',
            marginBottom: '20px'
        },
        actionButton: {
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px',
            border: 'none',
            borderRadius: '8px',
            background: '#f8f9fa',
            color: '#666',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontSize: '0.95rem',
            fontWeight: '500'
        },
        actionIcon: {
            fontSize: '1.1rem'
        },
        viewDetailsButton: {
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            padding: '12px',
            border: 'none',
            borderRadius: '8px',
            background: 'linear-gradient(45deg, #FF6B6B, #FFA500)',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontSize: '0.95rem',
            fontWeight: '500'
        },
        commentInputContainer: {
            marginTop: '20px',
            animation: 'slideDown 0.3s ease'
        },
        commentInput: {
            width: '100%',
            padding: '15px',
            border: '2px solid #eee',
            borderRadius: '12px',
            marginBottom: '10px',
            resize: 'vertical',
            minHeight: '80px',
            fontSize: '0.95rem',
            transition: 'all 0.3s ease'
        },
        submitButton: {
            width: '100%',
            padding: '12px',
            border: 'none',
            borderRadius: '8px',
            background: 'linear-gradient(45deg, #FF6B6B, #FFA500)',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontSize: '0.95rem',
            fontWeight: '500'
        },
        commentsSection: {
            marginTop: '20px',
            paddingTop: '20px',
            borderTop: '1px solid #eee'
        },
        commentItem: {
            marginBottom: '15px'
        },
        commentHeader: {
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            marginBottom: '5px'
        },
        commentAvatar: {
            color: '#666',
            fontSize: '1.2rem'
        },
        commentAuthor: {
            fontSize: '0.9rem',
            fontWeight: '500',
            color: '#333'
        },
        commentText: {
            fontSize: '0.95rem',
            color: '#555',
            margin: 0,
            paddingLeft: '30px'
        },
        viewAllComments: {
            background: 'none',
            border: 'none',
            color: '#3a86ff',
            cursor: 'pointer',
            padding: '5px 0',
            fontSize: '0.9rem',
            fontWeight: '500',
            width: '100%',
            textAlign: 'left'
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
                    <h1 style={styles.title}>Cooking Challenges</h1>
                    <p style={styles.subtitle}>Join the culinary adventure</p>
                    
                    {/* Search and Sort */}
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

                {/* Feed Container */}
                <div style={styles.feedContainer}>
                    {/* Active Challenges */}
                    {activeChallenges.length > 0 && (
                        <div style={styles.feedSection}>
                            <h2 style={styles.sectionTitle}>
                                <FaFireAlt style={{ color: '#ff6b6b' }} />
                                Active Challenges
                            </h2>
                            {activeChallenges.map(challenge => renderChallengeCard(challenge))}
                        </div>
                    )}

                    {/* Upcoming Challenges */}
                    {upcomingChallenges.length > 0 && (
                        <div style={styles.feedSection}>
                            <h2 style={styles.sectionTitle}>
                                <FaClock style={{ color: '#3a86ff' }} />
                                Upcoming Challenges
                            </h2>
                            {upcomingChallenges.map(challenge => renderChallengeCard(challenge))}
                        </div>
                    )}

                    {/* Past Challenges */}
                    {pastChallenges.length > 0 && (
                        <div style={styles.feedSection}>
                            <h2 style={styles.sectionTitle}>
                                <FaTrophy style={{ color: '#FFA500' }} />
                                Past Challenges
                            </h2>
                            {pastChallenges.map(challenge => renderChallengeCard(challenge))}
                        </div>
                    )}

                    {challenges.length === 0 && !loading && (
                        <div style={styles.noResultsContainer}>
                            <FaTrophy style={styles.noResultsIcon} />
                            <h2>No Challenges Found</h2>
                            <p>Try adjusting your search or check back later for new challenges.</p>
                        </div>
                    )}
                </div>
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
                    
                    .feed-card {
                        transition: all 0.3s ease;
                    }
                    
                    .feed-card:hover {
                        transform: translateY(-5px);
                        box-shadow: 0 15px 35px rgba(0,0,0,0.12);
                    }
                    
                    .feed-card:hover .challengeImage {
                        transform: scale(1.02);
                    }
                    
                    .action-button:hover {
                        background-color: #f0f0f0;
                        transform: translateY(-2px);
                    }
                    
                    .view-details-button:hover {
                        background: linear-gradient(45deg, #FF6B6B, #FFA500);
                        transform: translateY(-2px);
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