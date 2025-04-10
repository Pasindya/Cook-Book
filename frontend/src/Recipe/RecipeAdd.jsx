import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { FaClock, FaUtensils, FaListUl, FaLayerGroup } from 'react-icons/fa';
import { GiCook } from 'react-icons/gi';

function RecipeAdd() {
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState({
    title: '',
    description: '',
    recipeImage: null,
    ingredients: '',
    steps: '',
    time: '',
    type: '',
    category: ''
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const onInputChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === 'recipeImage') {
      if (files && files.length > 0) {
        const file = files[0];
        
        // Validate file type
        if (!file.type.match('image.*')) {
          setError('Please select an image file (JPEG, PNG, etc.)');
          return;
        }
        
        // Validate file size (2MB max)
        if (file.size > 2 * 1024 * 1024) {
          setError('Image size should be less than 2MB');
          return;
        }
        
        setError(null);
        setRecipe({ ...recipe, recipeImage: file });

        const reader = new FileReader();
        reader.onloadend = () => setPreviewImage(reader.result);
        reader.readAsDataURL(file);
      }
    } else {
      setRecipe({ ...recipe, [name]: value });
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      let imageName = '';
      if (recipe.recipeImage) {
        const formData = new FormData();
        formData.append("file", recipe.recipeImage);

        const res = await axios.post(
          "http://localhost:8080/recipes/recipeImg", 
          formData, 
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );
        imageName = res.data;
      }

      const recipeData = { 
        ...recipe, 
        recipeImage: imageName 
      };
      
      await axios.post(
        "http://localhost:8080/recipes", 
        recipeData, 
        { headers: { 'Content-Type': 'application/json' } }
      );
      
      alert("Recipe added successfully!");
      navigate('/displayrecipe');
    } catch (err) {
      console.error("Error:", err);
      setError(err.response?.data?.message || "Error saving recipe. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.pageContainer}>
      <Navbar />
      
      <div style={styles.container}>
        <h1 style={styles.heading}>
          <GiCook style={styles.headingIcon} />
          Share Your Recipe
        </h1>
        
        {error && (
          <div style={styles.errorBox}>
            {error}
          </div>
        )}
        
        <form onSubmit={onSubmit} style={styles.form}>
          {/* Recipe Title */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              <FaUtensils style={styles.labelIcon} />
              Recipe Title
            </label>
            <input
              name="title"
              value={recipe.title}
              onChange={onInputChange}
              placeholder="e.g., Grandma's Chocolate Chip Cookies"
              style={styles.input}
              required
            />
          </div>
          
          {/* Description */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              <FaUtensils style={styles.labelIcon} />
              Description
            </label>
            <textarea
              name="description"
              value={recipe.description}
              onChange={onInputChange}
              placeholder="Tell us about your recipe..."
              style={{...styles.input, ...styles.textarea}}
              required
            />
          </div>
          
          {/* Recipe Image */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              <FaUtensils style={styles.labelIcon} />
              Recipe Image
            </label>
            <div style={styles.fileUploadContainer}>
              <label style={styles.fileUploadLabel}>
                Choose Image
                <input
                  name="recipeImage"
                  type="file"
                  accept="image/*"
                  onChange={onInputChange}
                  style={styles.fileInput}
                />
              </label>
              {previewImage && (
                <div style={styles.imagePreviewContainer}>
                  <img 
                    src={previewImage} 
                    alt="preview" 
                    style={styles.imagePreview} 
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setRecipe({...recipe, recipeImage: null});
                      setPreviewImage(null);
                    }}
                    style={styles.removeImageButton}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {/* Ingredients */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              <FaListUl style={styles.labelIcon} />
              Ingredients
            </label>
            <textarea
              name="ingredients"
              value={recipe.ingredients}
              onChange={onInputChange}
              placeholder="List ingredients (one per line or separated by commas)"
              style={{...styles.input, ...styles.textarea, minHeight: '100px'}}
              required
            />
          </div>
          
          {/* Steps */}
          <div style={styles.formGroup}>
            <label style={styles.label}>
              <FaLayerGroup style={styles.labelIcon} />
              Preparation Steps
            </label>
            <textarea
              name="steps"
              value={recipe.steps}
              onChange={onInputChange}
              placeholder="Describe each step in detail..."
              style={{...styles.input, ...styles.textarea, minHeight: '150px'}}
              required
            />
          </div>
          
          {/* Time, Type, Category */}
          <div style={styles.rowGroup}>
            <div style={{...styles.formGroup, flex: 1}}>
              <label style={styles.label}>
                <FaClock style={styles.labelIcon} />
                Time Required
              </label>
              <input
                name="time"
                value={recipe.time}
                onChange={onInputChange}
                placeholder="e.g., 30 mins"
                style={styles.input}
                required
              />
            </div>
            
            <div style={{...styles.formGroup, flex: 1}}>
              <label style={styles.label}>
                <FaUtensils style={styles.labelIcon} />
                Type
              </label>
              <input
                name="type"
                value={recipe.type}
                onChange={onInputChange}
                placeholder="e.g., Dessert"
                style={styles.input}
                required
              />
            </div>
            
            <div style={{...styles.formGroup, flex: 1}}>
              <label style={styles.label}>
                <FaUtensils style={styles.labelIcon} />
                Category
              </label>
              <input
                name="category"
                value={recipe.category}
                onChange={onInputChange}
                placeholder="e.g., Vegetarian"
                style={styles.input}
                required
              />
            </div>
          </div>
          
          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              ...styles.submitButton,
              backgroundColor: isSubmitting ? '#95a5a6' : '#ff6b6b'
            }}
          >
            {isSubmitting ? (
              <span>Publishing Recipe...</span>
            ) : (
              <span>Publish Recipe</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  pageContainer: {
    backgroundColor: '#f9f9f9',
    minHeight: '100vh',
  },
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '2rem',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  heading: {
    color: '#333',
    textAlign: 'center',
    marginBottom: '2rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2rem',
  },
  headingIcon: {
    marginRight: '10px',
    color: '#ff6b6b',
    fontSize: '1.8rem',
  },
  errorBox: {
    backgroundColor: '#ffebee',
    color: '#c62828',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1.5rem',
    borderLeft: '4px solid #c62828',
  },
  form: {
    backgroundColor: 'white',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
  },
  formGroup: {
    marginBottom: '1.5rem',
  },
  rowGroup: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '1.5rem',
  },
  label: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '0.5rem',
    fontWeight: '600',
    color: '#333',
    fontSize: '0.95rem',
  },
  labelIcon: {
    marginRight: '8px',
    color: '#ff6b6b',
    fontSize: '0.9rem',
  },
  input: {
    width: '100%',
    padding: '0.8rem',
    border: '1px solid #ddd',
    borderRadius: '6px',
    fontSize: '1rem',
    transition: 'border 0.3s',
  },
  textarea: {
    minHeight: '80px',
    resize: 'vertical',
  },
  fileUploadContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  fileUploadLabel: {
    display: 'inline-block',
    padding: '0.8rem 1.2rem',
    backgroundColor: '#f0f0f0',
    color: '#333',
    borderRadius: '6px',
    cursor: 'pointer',
    textAlign: 'center',
    transition: 'background-color 0.3s',
    fontWeight: '500',
    border: '1px dashed #ccc',
    '&:hover': {
      backgroundColor: '#e0e0e0',
    },
  },
  fileInput: {
    display: 'none',
  },
  imagePreviewContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
  },
  imagePreview: {
    maxWidth: '100%',
    maxHeight: '300px',
    borderRadius: '6px',
    border: '1px solid #eee',
  },
  removeImageButton: {
    padding: '0.4rem 0.8rem',
    backgroundColor: '#ff4444',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  },
  submitButton: {
    width: '100%',
    padding: '1rem',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: '600',
    marginTop: '1rem',
    transition: 'background-color 0.3s',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

export default RecipeAdd;