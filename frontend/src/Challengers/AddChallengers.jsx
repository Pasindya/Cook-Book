import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';

function AddChallengers() {
  const [formData, setFormData] = useState({
    ChallengeTitle: '',
    challengeDetails: '',
    challengeImage: null,
    startDate: '',
    endDate: '',
    Rules: ''
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        challengeImage: file
      }));
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('ChallengeTitle', formData.ChallengeTitle);
      formDataToSend.append('challengeDetails', formData.challengeDetails);
      formDataToSend.append('startDate', formData.startDate);
      formDataToSend.append('endDate', formData.endDate);
      formDataToSend.append('Rules', formData.Rules);
      
      if (formData.challengeImage) {
        formDataToSend.append('challengeImage', formData.challengeImage);
      }

      const response = await axios.post('http://localhost:8080/api/challenges', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccessMessage('Challenge added successfully!');
      // Reset form
      setFormData({
        ChallengeTitle: '',
        challengeDetails: '',
        challengeImage: null,
        startDate: '',
        endDate: '',
        Rules: ''
      });
      setPreviewImage(null);
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrorMessage(error.response?.data || 'Failed to add challenge. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <Navbar />
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-amber-50 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Form Header */}
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 p-6 text-white">
          <h1 className="text-3xl font-bold">Create New Cooking Challenge</h1>
          <p className="mt-2 opacity-90">Fill out the form below to add a new exciting challenge for our community</p>
        </div>

        {/* Messages */}
        <div className="px-6 pt-4">
          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg border border-green-200">
              {successMessage}
            </div>
          )}
          
          {errorMessage && (
            <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg border border-red-200">
              {errorMessage}
            </div>
          )}
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Challenge Title */}
            <div className="col-span-2">
              <label htmlFor="ChallengeTitle" className="block text-sm font-medium text-gray-700 mb-1">
                Challenge Title <span className="text-orange-600">*</span>
              </label>
              <input
                type="text"
                id="ChallengeTitle"
                name="ChallengeTitle"
                value={formData.ChallengeTitle}
                onChange={handleChange}
                required
                placeholder="Ex: Summer BBQ Master Challenge"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
              />
            </div>

            {/* Challenge Details */}
            <div className="col-span-2">
              <label htmlFor="challengeDetails" className="block text-sm font-medium text-gray-700 mb-1">
                Challenge Description <span className="text-orange-600">*</span>
              </label>
              <textarea
                id="challengeDetails"
                name="challengeDetails"
                value={formData.challengeDetails}
                onChange={handleChange}
                required
                rows={4}
                placeholder="Describe the challenge in detail..."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
              />
            </div>

            {/* Image Upload */}
            <div className="col-span-2">
              <label htmlFor="challengeImage" className="block text-sm font-medium text-gray-700 mb-1">
                Challenge Image
              </label>
              <div className="flex items-center gap-4">
                <label className="flex flex-col items-center justify-center w-64 h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, JPEG (MAX. 5MB)
                    </p>
                  </div>
                  <input 
                    id="challengeImage" 
                    name="challengeImage" 
                    type="file" 
                    className="hidden" 
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </label>
                {previewImage && (
                  <div className="relative">
                    <img src={previewImage} alt="Preview" className="w-32 h-32 object-cover rounded-lg" />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewImage(null);
                        setFormData(prev => ({...prev, challengeImage: null}));
                      }}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Dates */}
            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date <span className="text-orange-600">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition appearance-none"
                />
                <span className="absolute right-3 top-2.5 text-amber-600 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </span>
              </div>
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                End Date <span className="text-orange-600">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                  min={formData.startDate || new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition appearance-none"
                />
                <span className="absolute right-3 top-2.5 text-amber-600 pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </span>
              </div>
            </div>

            {/* Rules */}
            <div className="col-span-2">
              <label htmlFor="Rules" className="block text-sm font-medium text-gray-700 mb-1">
                Challenge Rules <span className="text-orange-600">*</span>
              </label>
              <textarea
                id="Rules"
                name="Rules"
                value={formData.Rules}
                onChange={handleChange}
                required
                rows={4}
                placeholder="List the rules participants must follow..."
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
              />
              <p className="mt-1 text-xs text-gray-500">Separate rules with new lines or bullet points</p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              onClick={() => navigate('/displaychallengers')}
              className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-medium rounded-lg shadow-md hover:from-amber-600 hover:to-orange-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Challenge...
                </span>
              ) : (
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                  </svg>
                  Create Challenge
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
}

export default AddChallengers;