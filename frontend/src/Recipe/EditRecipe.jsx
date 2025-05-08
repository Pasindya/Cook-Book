import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EditRecipe() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [recipe, setRecipe] = useState({
        title: '',
        description: '',
        ingredients: '',
        steps: '',
        time: '',
        type: '',
        category: ''
    });
    const [image, setImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');

    useEffect(() => {
        loadRecipe();
    }, [id]);

    const loadRecipe = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/api/recipes/${id}`);
            const recipeData = response.data;
            setRecipe({
                title: recipeData.title || '',
                description: recipeData.description || '',
                ingredients: recipeData.ingredients || '',
                steps: recipeData.steps || '',
                time: recipeData.time || '',
                type: recipeData.type || '',
                category: recipeData.category || ''
            });
            if (recipeData.recipeImage) {
                setPreviewUrl(`http://localhost:8080/api/recipes/images/${recipeData.recipeImage}`);
            }
        } catch (error) {
            console.error('Error loading recipe:', error);
            toast.error('Failed to load recipe');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRecipe(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error('Image size should be less than 2MB');
                return;
            }
            setImage(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validate required fields
        if (!recipe.title || !recipe.description || !recipe.ingredients || !recipe.steps || !recipe.time || !recipe.type || !recipe.category) {
            toast.error('Please fill in all required fields');
            return;
        }

        try {
            const formData = new FormData();
            formData.append('title', recipe.title.trim());
            formData.append('description', recipe.description.trim());
            formData.append('ingredients', recipe.ingredients.trim());
            formData.append('steps', recipe.steps.trim());
            formData.append('time', recipe.time.trim());
            formData.append('type', recipe.type.trim());
            formData.append('category', recipe.category.trim());
            
            if (image) {
                formData.append('recipeImage', image);
            }

            const response = await axios.put(`http://localhost:8080/api/recipes/${id}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                toast.success('Recipe updated successfully');
                navigate('/displayrecipe');
            }
        } catch (error) {
            console.error('Error updating recipe:', error);
            toast.error(error.response?.data?.error || 'Failed to update recipe');
        }
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <div>Loading...</div>
            </div>
        );
    }

    return (
        <div>
            <Navbar />
            <div style={{
                maxWidth: '800px',
                margin: '0 auto',
                padding: '20px',
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
            }}>
                <h1 style={{
                    textAlign: 'center',
                    color: '#333',
                    marginBottom: '30px'
                }}>Edit Recipe</h1>

                <form onSubmit={handleSubmit} style={{
                    background: 'white',
                    padding: '20px',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '5px',
                            color: '#333',
                            fontWeight: 'bold'
                        }}>Title *</label>
                        <input
                            type="text"
                            name="title"
                            value={recipe.title}
                            onChange={handleInputChange}
                            style={{
                                width: '100%',
                                padding: '8px',
                                borderRadius: '4px',
                                border: '1px solid #ddd'
                            }}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '5px',
                            color: '#333',
                            fontWeight: 'bold'
                        }}>Description *</label>
                        <textarea
                            name="description"
                            value={recipe.description}
                            onChange={handleInputChange}
                            style={{
                                width: '100%',
                                padding: '8px',
                                borderRadius: '4px',
                                border: '1px solid #ddd',
                                minHeight: '100px'
                            }}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '5px',
                            color: '#333',
                            fontWeight: 'bold'
                        }}>Ingredients *</label>
                        <textarea
                            name="ingredients"
                            value={recipe.ingredients}
                            onChange={handleInputChange}
                            style={{
                                width: '100%',
                                padding: '8px',
                                borderRadius: '4px',
                                border: '1px solid #ddd',
                                minHeight: '100px'
                            }}
                            placeholder="Enter ingredients, one per line"
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '5px',
                            color: '#333',
                            fontWeight: 'bold'
                        }}>Steps *</label>
                        <textarea
                            name="steps"
                            value={recipe.steps}
                            onChange={handleInputChange}
                            style={{
                                width: '100%',
                                padding: '8px',
                                borderRadius: '4px',
                                border: '1px solid #ddd',
                                minHeight: '150px'
                            }}
                            placeholder="Enter steps, one per line"
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '5px',
                            color: '#333',
                            fontWeight: 'bold'
                        }}>Cooking Time (minutes) *</label>
                        <input
                            type="number"
                            name="time"
                            value={recipe.time}
                            onChange={handleInputChange}
                            style={{
                                width: '100%',
                                padding: '8px',
                                borderRadius: '4px',
                                border: '1px solid #ddd'
                            }}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '5px',
                            color: '#333',
                            fontWeight: 'bold'
                        }}>Type *</label>
                        <select
                            name="type"
                            value={recipe.type}
                            onChange={handleInputChange}
                            style={{
                                width: '100%',
                                padding: '8px',
                                borderRadius: '4px',
                                border: '1px solid #ddd'
                            }}
                            required
                        >
                            <option value="">Select Type</option>
                            <option value="Vegetarian">Vegetarian</option>
                            <option value="Vegan">Vegan</option>
                            <option value="Meat">Meat</option>
                            <option value="Dessert">Dessert</option>
                            <option value="Spicy">Spicy</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '5px',
                            color: '#333',
                            fontWeight: 'bold'
                        }}>Category *</label>
                        <select
                            name="category"
                            value={recipe.category}
                            onChange={handleInputChange}
                            style={{
                                width: '100%',
                                padding: '8px',
                                borderRadius: '4px',
                                border: '1px solid #ddd'
                            }}
                            required
                        >
                            <option value="">Select Category</option>
                            <option value="Breakfast">Breakfast</option>
                            <option value="Lunch">Lunch</option>
                            <option value="Dinner">Dinner</option>
                            <option value="Snacks">Snacks</option>
                            <option value="Desserts">Desserts</option>
                        </select>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            marginBottom: '5px',
                            color: '#333',
                            fontWeight: 'bold'
                        }}>Recipe Image</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{
                                width: '100%',
                                padding: '8px',
                                borderRadius: '4px',
                                border: '1px solid #ddd'
                            }}
                        />
                        {previewUrl && (
                            <img
                                src={previewUrl}
                                alt="Recipe preview"
                                style={{
                                    maxWidth: '200px',
                                    marginTop: '10px',
                                    borderRadius: '4px'
                                }}
                            />
                        )}
                    </div>

                    <div style={{
                        display: 'flex',
                        gap: '10px',
                        justifyContent: 'center'
                    }}>
                        <button
                            type="submit"
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#4CAF50',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '16px'
                            }}
                        >
                            Update Recipe
                        </button>
                        <button
                            type="button"
                            onClick={() => navigate('/displayrecipe')}
                            style={{
                                padding: '10px 20px',
                                backgroundColor: '#666',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                fontSize: '16px'
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default EditRecipe; 