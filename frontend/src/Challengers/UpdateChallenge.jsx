import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaCalendarAlt, FaTimes, FaSave } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function UpdateChallenge() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [challenge, setChallenge] = useState({
        ChallengeTitle: '',
        challengeDetails: '',
        startDate: '',
        endDate: '',
        Rules: '',
        challengeImage: null
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImage, setPreviewImage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChallenge = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/api/challenges/${id}`);
                setChallenge(response.data);
                if (response.data.challengeImage) {
                    setPreviewImage(`http://localhost:8080/uploads/${response.data.challengeImage}`);
                }
                setLoading(false);
            } catch (error) {
                console.error("Error fetching challenge:", error);
                toast.error('Failed to load challenge');
                navigate('/challenges');
            }
        };

        fetchChallenge();
    }, [id, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setChallenge(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            // Log the current state before submission
            console.log('Current challenge state:', challenge);
            console.log('Selected file:', selectedFile);

            const formData = new FormData();
            
            // Log each field before appending
            console.log('Appending fields to FormData:');
            console.log('Title:', challenge.ChallengeTitle);
            console.log('Details:', challenge.challengeDetails);
            console.log('Start Date:', challenge.startDate);
            console.log('End Date:', challenge.endDate);
            console.log('Rules:', challenge.Rules);
            
            // Append all fields
            formData.append('ChallengeTitle', challenge.ChallengeTitle);
            formData.append('challengeDetails', challenge.challengeDetails);
            formData.append('startDate', challenge.startDate);
            formData.append('endDate', challenge.endDate);
            formData.append('Rules', challenge.Rules);
            
            if (selectedFile) {
                console.log('Appending file:', selectedFile.name);
                formData.append('challengeImage', selectedFile);
            }

            // Log the FormData contents
            for (let pair of formData.entries()) {
                console.log('FormData entry:', pair[0], pair[1]);
            }

            console.log('Sending PUT request to:', `http://localhost:8080/api/challenges/${id}`);
            
            const response = await axios.put(
                `http://localhost:8080/api/challenges/${id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            console.log('Response received:', response);
            
            if (response.data) {
                console.log('Update successful:', response.data);
                toast.success('Challenge updated successfully!');
                navigate('/displaychallengers');
            } else {
                throw new Error('No response data received');
            }
        } catch (error) {
            console.error("Error updating challenge:", error);
            let errorMessage = 'Failed to update challenge';
            
            if (error.response) {
                console.error("Error response data:", error.response.data);
                console.error("Error response status:", error.response.status);
                console.error("Error response headers:", error.response.headers);
                errorMessage = error.response.data || errorMessage;
            } else if (error.request) {
                console.error("No response received:", error.request);
                errorMessage = 'No response from server. Please check if the server is running.';
            } else {
                console.error("Error setting up request:", error.message);
                errorMessage = error.message;
            }
            
            toast.error(errorMessage);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 py-8 px-4">
            <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6 text-white">
                    <h1 className="text-3xl font-bold">Update Cooking Challenge</h1>
                    <p className="mt-2 opacity-90">Modify the challenge details below</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label htmlFor="ChallengeTitle" className="block text-sm font-medium text-gray-700 mb-1">
                            Challenge Title
                        </label>
                        <input
                            type="text"
                            id="ChallengeTitle"
                            name="ChallengeTitle"
                            value={challenge.ChallengeTitle}
                            onChange={handleInputChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        />
                    </div>

                    <div>
                        <label htmlFor="challengeDetails" className="block text-sm font-medium text-gray-700 mb-1">
                            Challenge Details
                        </label>
                        <textarea
                            id="challengeDetails"
                            name="challengeDetails"
                            value={challenge.challengeDetails}
                            onChange={handleInputChange}
                            rows="4"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                                Start Date
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    id="startDate"
                                    name="startDate"
                                    value={challenge.startDate}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
                                    required
                                />
                                <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                                End Date
                            </label>
                            <div className="relative">
                                <input
                                    type="date"
                                    id="endDate"
                                    name="endDate"
                                    value={challenge.endDate}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10"
                                    required
                                    min={challenge.startDate}
                                />
                                <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="Rules" className="block text-sm font-medium text-gray-700 mb-1">
                            Rules
                        </label>
                        <textarea
                            id="Rules"
                            name="Rules"
                            value={challenge.Rules}
                            onChange={handleInputChange}
                            rows="3"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        ></textarea>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Challenge Image
                        </label>
                        <div className="flex items-center space-x-4">
                            {previewImage && (
                                <div className="relative">
                                    <img 
                                        src={previewImage} 
                                        alt="Preview" 
                                        className="h-32 w-32 object-cover rounded-md"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setPreviewImage('');
                                            setSelectedFile(null);
                                        }}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                            )}
                            <label className="flex flex-col items-center justify-center w-64 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                    </svg>
                                    <p className="mb-2 text-sm text-gray-500">
                                        <span className="font-semibold">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-xs text-gray-500">PNG, JPG, JPEG (MAX. 5MB)</p>
                                </div>
                                <input 
                                    type="file" 
                                    className="hidden" 
                                    onChange={handleFileChange}
                                    accept="image/*"
                                />
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate('/displaychallengers')}
                            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center"
                        >
                            <FaSave className="mr-2" />
                            Update Challenge
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UpdateChallenge;