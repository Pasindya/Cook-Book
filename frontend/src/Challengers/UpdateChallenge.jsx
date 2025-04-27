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
            const formData = new FormData();
            formData.append('ChallengeTitle', challenge.ChallengeTitle);
            formData.append('challengeDetails', challenge.challengeDetails);
            formData.append('startDate', challenge.startDate);
            formData.append('endDate', challenge.endDate);
            formData.append('Rules', challenge.Rules);
            
            if (selectedFile) {
                formData.append('file', selectedFile);
            }

            const response = await axios.put(
                `http://localhost:8080/api/challenges/${id}`,
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );

            toast.success('Challenge updated successfully!');
            navigate('/challenges');
        } catch (error) {
            console.error("Error updating challenge:", error);
            toast.error('Failed to update challenge');
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
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-800">Update Cooking Challenge</h2>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="grid grid-cols-1 gap-6">
                            {/* Challenge Title */}
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
                            
                            {/* Challenge Details */}
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
                            
                            {/* Date Range */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                            
                            {/* Rules */}
                            <div>
                                <label htmlFor="Rules" className="block text-sm font-medium text-gray-700 mb-1">
                                    Rules (One per line)
                                </label>
                                <textarea
                                    id="Rules"
                                    name="Rules"
                                    value={challenge.Rules}
                                    onChange={handleInputChange}
                                    rows="4"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    required
                                    placeholder="Enter each rule on a new line"
                                ></textarea>
                            </div>
                            
                            {/* Image Upload */}
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
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <label className="flex flex-col items-center px-4 py-2 bg-white text-blue-500 rounded-lg border border-blue-500 cursor-pointer hover:bg-blue-50">
                                            <span className="text-sm font-medium">
                                                {selectedFile ? 'Change Image' : 'Upload Image'}
                                            </span>
                                            <input 
                                                type="file" 
                                                className="hidden" 
                                                accept="image/*"
                                                onChange={handleFileChange}
                                            />
                                        </label>
                                        <p className="mt-1 text-xs text-gray-500">
                                            {selectedFile ? selectedFile.name : 'No file selected'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-8 flex justify-end space-x-3">
                            <button
                                type="button"
                                onClick={() => navigate('/challenges')}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
                            >
                                <FaSave className="mr-2" />
                                Update Challenge
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UpdateChallenge;