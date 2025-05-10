import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { 
    FaHeart, FaRegHeart, FaShareAlt, FaClock, 
    FaUtensils, FaEllipsisH, FaRegBookmark, 
    FaBookmark, FaFireAlt, FaLeaf, FaBreadSlice,
    FaComment, FaUser, FaStar, FaRegStar, 
    FaTrophy, FaCalendarAlt, FaUsers
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

    const renderChallengeCard = (challenge) => (
        <div key={challenge.id} style={styles.challengeCard}>
            {/* Status Badge */}
            <div style={styles.statusBadge}>
                {getStatusBadge(challenge.startDate, challenge.endDate)}
            </div>
            
            {/* Challenge Image */}
            <div style={styles.imageContainer}>
                {challenge.challengeImage ? (
                    <img 
                        src={`http://localhost:8080/uploads/${challenge.challengeImage}`}
                        alt={challenge.ChallengeTitle}
                        style={styles.challengeImage}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/400x250?text=Challenge+Image';
                        }}
                    />
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
                
                {/* Challenge Stats */}
                <div style={styles.statsContainer}>
                    <div style={styles.stat}>
                        <FaUsers /> {challenge.participants || 0} Participants
                    </div>
                    <div style={styles.stat}>
                        <FaHeart /> {challenge.likes || 0} Likes
                    </div>
                    <div style={styles.stat}>
                        <FaComment /> {challenge.comments?.length || 0} Comments
                    </div>
                </div>
                
                {/* Action Buttons */}
                <div style={styles.actionButtons}>
                    <button 
                        onClick={() => toggleLike(challenge.id)}
                        style={styles.actionButton}
                    >
                        {likedChallenges.includes(challenge.id) ? <FaHeart style={styles.likedIcon} /> : <FaRegHeart />}
                        Like
                    </button>
                    
                    <button 
                        onClick={() => toggleCommentInput(challenge.id)}
                        style={styles.actionButton}
                    >
                        <FaComment />
                        Comment
                    </button>
                    
                    <button 
                        onClick={() => toggleSave(challenge.id)}
                        style={styles.actionButton}
                    >
                        {savedChallenges.includes(challenge.id) ? <FaBookmark style={styles.savedIcon} /> : <FaRegBookmark />}
                        Save
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
            marginBottom: '40px'
        },
        title: {
            fontSize: '2.5rem',
            color: '#333',
            marginBottom: '15px'
        },
        subtitle: {
            fontSize: '1.1rem',
            color: '#666',
            marginBottom: '30px'
        },
        sectionTitle: {
            fontSize: '1.8rem',
            color: '#333',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
        },
        challengeCard: {
            background: '#fff',
            borderRadius: '16px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.08)',
            overflow: 'hidden',
            transition: 'all 0.3s ease',
            marginBottom: '30px',
            position: 'relative'
        },
        statusBadge: {
            position: 'absolute',
            top: '15px',
            right: '15px',
            zIndex: '1'
        },
        upcomingBadge: {
            background: '#e3f2fd',
            color: '#1976d2',
            padding: '5px 12px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: '600'
        },
        activeBadge: {
            background: '#e8f5e9',
            color: '#2e7d32',
            padding: '5px 12px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: '600'
        },
        pastBadge: {
            background: '#f5f5f5',
            color: '#616161',
            padding: '5px 12px',
            borderRadius: '20px',
            fontSize: '0.8rem',
            fontWeight: '600'
        },
        imageContainer: {
            width: '100%',
            height: '250px',
            overflow: 'hidden',
            position: 'relative'
        },
        challengeImage: {
            width: '100%',
            height: '100%',
            objectFit: 'cover'
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
            fontSize: '3rem'
        },
        challengeContent: {
            padding: '20px'
        },
        challengeTitle: {
            fontSize: '1.5rem',
            color: '#333',
            marginBottom: '15px',
            fontWeight: '600'
        },
        dateContainer: {
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '15px',
            color: '#666'
        },
        dateIcon: {
            color: '#3a86ff'
        },
        dateText: {
            fontSize: '0.9rem'
        },
        challengeDescription: {
            color: '#555',
            lineHeight: '1.6',
            marginBottom: '20px'
        },
        statsContainer: {
            display: 'flex',
            gap: '20px',
            marginBottom: '20px',
            padding: '15px 0',
            borderTop: '1px solid #eee',
            borderBottom: '1px solid #eee'
        },
        stat: {
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            color: '#666',
            fontSize: '0.9rem'
        },
        actionButtons: {
            display: 'flex',
            gap: '15px',
            marginBottom: '20px'
        },
        actionButton: {
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '8px 15px',
            border: 'none',
            background: '#f8f9fa',
            borderRadius: '20px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontSize: '0.9rem',
            color: '#666'
        },
        likedIcon: {
            color: '#ff6b6b'
        },
        savedIcon: {
            color: '#3a86ff'
        },
        commentInputContainer: {
            marginTop: '15px'
        },
        commentInput: {
            width: '100%',
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            marginBottom: '10px',
            resize: 'vertical',
            minHeight: '80px'
        },
        reviewInputContainer: {
            marginTop: '15px'
        },
        ratingContainer: {
            display: 'flex',
            gap: '5px',
            marginBottom: '10px'
        },
        starIcon: {
            fontSize: '1.2rem',
            cursor: 'pointer'
        },
        reviewInput: {
            width: '100%',
            padding: '12px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            marginBottom: '10px',
            resize: 'vertical',
            minHeight: '100px'
        },
        submitButton: {
            background: '#3a86ff',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '20px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontSize: '0.9rem',
            fontWeight: '600'
        },
        loadingContainer: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '200px'
        },
        loadingSpinner: {
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #3a86ff',
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
                </div>

                {/* Active Challenges */}
                {activeChallenges.length > 0 && (
                    <div>
                        <h2 style={styles.sectionTitle}>
                            <FaFireAlt style={{ color: '#ff6b6b' }} />
                            Active Challenges
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '30px' }}>
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
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '30px' }}>
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
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '30px' }}>
                            {pastChallenges.map(challenge => renderChallengeCard(challenge))}
                        </div>
                    </div>
                )}

                {challenges.length === 0 && !loading && (
                    <div style={{
                        textAlign: 'center',
                        padding: '40px',
                        background: '#fff',
                        borderRadius: '12px',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
                    }}>
                        <FaTrophy style={{ fontSize: '3rem', color: '#FFA500', marginBottom: '20px' }} />
                        <h2 style={{ color: '#333', marginBottom: '15px' }}>No Challenges Found</h2>
                        <p style={{ color: '#666', marginBottom: '20px' }}>
                            There are no cooking challenges available right now. Check back later!
                        </p>
                    </div>
                )}
            </div>
            <ToastContainer />
        </div>
    );
}

export default AllChallengers; 