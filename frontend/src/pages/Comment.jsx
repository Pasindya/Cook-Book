import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaComment, FaArrowLeft, FaHeart, FaRegHeart } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Comment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [likedComments, setLikedComments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch recipe data
        const recipeResponse = await axios.get(`http://localhost:8080/recipes/${id}`);
        setRecipe(recipeResponse.data);
        
        // Fetch comments for this recipe
        const commentsResponse = await axios.get(`http://localhost:8080/recipes/${id}/comments`);
        setComments(commentsResponse.data);
        
        // Load liked comments from localStorage
        const liked = JSON.parse(localStorage.getItem('likedComments')) || [];
        setLikedComments(liked);
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error('Failed to load data');
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error('Please enter a comment');
      return;
    }
    
    try {
      const response = await axios.post(`http://localhost:8080/recipes/${id}/comments`, {
        text: newComment,
        author: 'Current User', // In a real app, you'd use the logged-in user's info
        timestamp: new Date().toISOString()
      });
      
      setComments([...comments, response.data]);
      setNewComment('');
      toast.success('Comment added successfully');
    } catch (error) {
      console.error("Error adding comment:", error);
      toast.error('Failed to add comment');
    }
  };

  const toggleLikeComment = (commentId) => {
    let updatedLikedComments;
    if (likedComments.includes(commentId)) {
      updatedLikedComments = likedComments.filter(id => id !== commentId);
    } else {
      updatedLikedComments = [...likedComments, commentId];
      toast('❤️ Liked!', { autoClose: 1000 });
    }
    setLikedComments(updatedLikedComments);
    localStorage.setItem('likedComments', JSON.stringify(updatedLikedComments));
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
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
          <h2 style={{ color: '#333', marginBottom: '20px' }}>Loading comments...</h2>
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

  if (!recipe) {
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
          <h2 style={{ color: '#333', marginBottom: '20px' }}>Recipe not found</h2>
          <button 
            onClick={() => navigate(-1)}
            style={{
              background: '#3a86ff',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '1rem',
              transition: 'all 0.2s ease',
              ':hover': {
                background: '#2a6fd6'
              }
            }}
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: '#f9f9f9',
      minHeight: '100vh'
    }}>
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header with back button */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        marginBottom: '20px',
        paddingBottom: '15px',
        borderBottom: '1px solid #eee'
      }}>
        <button 
          onClick={() => navigate(-1)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            marginRight: '15px',
            fontSize: '1.2rem',
            color: '#3a86ff'
          }}
        >
          <FaArrowLeft />
        </button>
        <h1 style={{
          margin: '0',
          fontSize: '1.5rem',
          color: '#333'
        }}>Comments</h1>
      </div>
      
      {/* Recipe Card */}
      <div style={{
        background: '#fff',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        padding: '15px',
        marginBottom: '20px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '15px'
        }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '8px',
            overflow: 'hidden',
            marginRight: '15px',
            flexShrink: '0'
          }}>
            <img 
              src={`http://localhost:8080/uploads/${recipe.recipeImage}`}
              alt={recipe.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/60?text=Recipe';
              }}
            />
          </div>
          <div>
            <h2 style={{
              margin: '0 0 5px',
              fontSize: '1.2rem',
              color: '#333'
            }}>{recipe.title}</h2>
            <p style={{
              margin: '0',
              color: '#666',
              fontSize: '0.9rem'
            }}>{recipe.description.substring(0, 100)}{recipe.description.length > 100 ? '...' : ''}</p>
          </div>
        </div>
      </div>
      
      {/* Comment Form */}
      <form onSubmit={handleCommentSubmit} style={{
        marginBottom: '30px',
        background: '#fff',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
        padding: '15px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '10px'
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
              fontSize: '0.95rem'
            }}
          />
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: '10px'
        }}>
          <button
            type="submit"
            style={{
              background: '#3a86ff',
              color: 'white',
              border: 'none',
              padding: '8px 20px',
              borderRadius: '18px',
              cursor: 'pointer',
              fontSize: '0.95rem',
              transition: 'all 0.2s ease',
              ':hover': {
                background: '#2a6fd6'
              }
            }}
          >
            Post Comment
          </button>
        </div>
      </form>
      
      {/* Comments List */}
      <div>
        <h3 style={{
          margin: '0 0 15px',
          fontSize: '1.2rem',
          color: '#333',
          paddingBottom: '10px',
          borderBottom: '1px solid #eee'
        }}>
          {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
        </h3>
        
        {comments.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '30px',
            color: '#666'
          }}>
            <FaComment style={{ fontSize: '2rem', marginBottom: '10px', opacity: '0.5' }} />
            <p>No comments yet. Be the first to comment!</p>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            {comments.map((comment) => (
              <div key={comment.id} style={{
                background: '#fff',
                borderRadius: '10px',
                boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                padding: '15px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
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
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '5px'
                    }}>
                      <h4 style={{
                        margin: '0',
                        fontSize: '0.95rem',
                        fontWeight: '600',
                        color: '#333'
                      }}>{comment.author || 'Anonymous'}</h4>
                      <span style={{
                        fontSize: '0.8rem',
                        color: '#999'
                      }}>{formatDate(comment.timestamp)}</span>
                    </div>
                    <p style={{
                      margin: '0',
                      color: '#333',
                      fontSize: '0.95rem',
                      lineHeight: '1.5'
                    }}>{comment.text}</p>
                  </div>
                </div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: '15px'
                }}>
                  <button 
                    onClick={() => toggleLikeComment(comment.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      color: likedComments.includes(comment.id) ? '#ff6b6b' : '#666',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      transition: 'all 0.2s ease',
                      ':hover': {
                        color: '#ff6b6b'
                      }
                    }}
                  >
                    {likedComments.includes(comment.id) ? <FaHeart /> : <FaRegHeart />}
                    <span>Like</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default Comment;