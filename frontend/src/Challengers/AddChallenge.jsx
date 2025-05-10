import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaFireAlt, FaCalendarAlt, FaUtensils, FaLeaf } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/Navbar';

function AddChallenge() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        ChallengeTitle: '',
        challengeDetails: '',
        rules: '',
        startDate: '',
        endDate: '',
        challengeImage: null
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'challengeImage') {
            setFormData(prev => ({
                ...prev,
                [name]: files[0]
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formDataToSend = new FormData();
            Object.keys(formData).forEach(key => {
                formDataToSend.append(key, formData[key]);
            });

            const response = await axios.post('http://localhost:8080/api/challenges', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data) {
                toast.success('Challenge created successfully!');
                // Add a small delay to show the success message before navigating
                setTimeout(() => {
                    navigate('/displaychallengers', { 
                        state: { 
                            message: 'Challenge created successfully!',
                            type: 'success'
                        }
                    });
                }, 1500);
            }
        } catch (error) {
            console.error('Error creating challenge:', error);
            toast.error(error.response?.data || 'Failed to create challenge');
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div style={{
                maxWidth: '800px',
                margin: '0 auto',
                padding: '40px 20px',
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
            }}>
                <ToastContainer position="top-right" autoClose={3000} />
                
                <div style={{
                    textAlign: 'center',
                    marginBottom: '40px'
                }}>
                    <h1 style={{
                        fontSize: '2.5rem',
                        color: '#333',
                        marginBottom: '15px',
                        background: 'linear-gradient(45deg, #FF6B6B, #FFA500)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        display: 'inline-block'
                    }}>Create New Challenge</h1>
                    <p style={{
                        color: '#666',
                        fontSize: '1.1rem'
                    }}>Share your culinary challenge with the community</p>
                </div>

                <form onSubmit={handleSubmit} style={{
                    background: '#fff',
                    padding: '30px',
                    borderRadius: '20px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                }}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            color: '#666',
                            fontSize: '0.95rem'
                        }}>Challenge Title</label>
                        <input
                            type="text"
                            name="ChallengeTitle"
                            value={formData.ChallengeTitle}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid #ddd',
                                fontSize: '1rem'
                            }}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            color: '#666',
                            fontSize: '0.95rem'
                        }}>Challenge Details</label>
                        <textarea
                            name="challengeDetails"
                            value={formData.challengeDetails}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid #ddd',
                                fontSize: '1rem',
                                minHeight: '100px'
                            }}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            color: '#666',
                            fontSize: '0.95rem'
                        }}>Rules</label>
                        <textarea
                            name="rules"
                            value={formData.rules}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid #ddd',
                                fontSize: '1rem',
                                minHeight: '100px'
                            }}
                            required
                        />
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '20px',
                        marginBottom: '20px'
                    }}>
                        <div>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                color: '#666',
                                fontSize: '0.95rem'
                            }}>Start Date</label>
                            <input
                                type="date"
                                name="startDate"
                                value={formData.startDate}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #ddd',
                                    fontSize: '1rem'
                                }}
                                required
                            />
                        </div>

                        <div>
                            <label style={{
                                display: 'block',
                                marginBottom: '8px',
                                color: '#666',
                                fontSize: '0.95rem'
                            }}>End Date</label>
                            <input
                                type="date"
                                name="endDate"
                                value={formData.endDate}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: '1px solid #ddd',
                                    fontSize: '1rem'
                                }}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '8px',
                            color: '#666',
                            fontSize: '0.95rem'
                        }}>Challenge Image</label>
                        <input
                            type="file"
                            name="challengeImage"
                            onChange={handleChange}
                            accept="image/*"
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid #ddd',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '15px',
                            background: 'linear-gradient(45deg, #FF6B6B, #FFA500)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '30px',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1,
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {loading ? 'Creating Challenge...' : 'Create Challenge'}
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddChallenge; 