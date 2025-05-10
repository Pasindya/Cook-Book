import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaSpinner, FaInfoCircle, FaImage, FaTimes, FaClock, FaList, FaUtensils, FaTag } from 'react-icons/fa';

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
    const [errors, setErrors] = useState({});
    const [showPreview, setShowPreview] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

    const validateForm = () => {
        const newErrors = {};
        if (!recipe.title.trim()) newErrors.title = 'Title is required';
        if (!recipe.description.trim()) newErrors.description = 'Description is required';
        if (!recipe.ingredients.trim()) newErrors.ingredients = 'Ingredients are required';
        if (!recipe.steps.trim()) newErrors.steps = 'Steps are required';
        if (!recipe.time) newErrors.time = 'Cooking time is required';
        if (!recipe.type) newErrors.type = 'Type is required';
        if (!recipe.category) newErrors.category = 'Category is required';
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            toast.error('Please fill in all required fields correctly');
            return;
        }

        setIsSubmitting(true);
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
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
                flexDirection: 'column',
                gap: '20px',
                backgroundColor: '#f8f9fa'
            }}>
                <FaSpinner className="fa-spin" style={{ fontSize: '40px', color: '#4CAF50' }} />
                <div style={{ fontSize: '18px', color: '#666' }}>Loading recipe...</div>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
            <Navbar />
            <div style={{
                maxWidth: '1000px',
                margin: '0 auto',
                padding: '20px',
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
            }}>
                <div style={{
                    background: 'white',
                    borderRadius: '12px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    padding: '30px',
                    marginBottom: '20px'
                }}>
                    <h1 style={{
                        textAlign: 'center',
                        color: '#2c3e50',
                        marginBottom: '30px',
                        fontSize: '2.5rem',
                        fontWeight: '600'
                    }}>Edit Recipe</h1>

                    <form onSubmit={handleSubmit}>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '20px',
                            marginBottom: '30px'
                        }}>
                            <div>
                                <label style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    marginBottom: '8px',
                                    color: '#2c3e50',
                                    fontWeight: '600'
                                }}>
                                    <FaUtensils /> Title *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={recipe.title}
                                    onChange={handleInputChange}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: errors.title ? '1px solid #ff4444' : '1px solid #ddd',
                                        fontSize: '16px',
                                        transition: 'all 0.3s ease',
                                        backgroundColor: '#fff'
                                    }}
                                    placeholder="Enter recipe title"
                                    required
                                />
                                {errors.title && (
                                    <div style={{ color: '#ff4444', marginTop: '5px', fontSize: '14px' }}>
                                        {errors.title}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    marginBottom: '8px',
                                    color: '#2c3e50',
                                    fontWeight: '600'
                                }}>
                                    <FaClock /> Cooking Time (minutes) *
                                </label>
                                <input
                                    type="number"
                                    name="time"
                                    value={recipe.time}
                                    onChange={handleInputChange}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: errors.time ? '1px solid #ff4444' : '1px solid #ddd',
                                        fontSize: '16px',
                                        transition: 'all 0.3s ease',
                                        backgroundColor: '#fff'
                                    }}
                                    min="1"
                                    placeholder="Enter cooking time"
                                    required
                                />
                                {errors.time && (
                                    <div style={{ color: '#ff4444', marginTop: '5px', fontSize: '14px' }}>
                                        {errors.time}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ marginBottom: '30px' }}>
                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                marginBottom: '8px',
                                color: '#2c3e50',
                                fontWeight: '600'
                            }}>
                                <FaList /> Description *
                            </label>
                            <textarea
                                name="description"
                                value={recipe.description}
                                onChange={handleInputChange}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: errors.description ? '1px solid #ff4444' : '1px solid #ddd',
                                    minHeight: '120px',
                                    fontSize: '16px',
                                    resize: 'vertical',
                                    transition: 'all 0.3s ease',
                                    backgroundColor: '#fff'
                                }}
                                placeholder="Describe your recipe..."
                                required
                            />
                            {errors.description && (
                                <div style={{ color: '#ff4444', marginTop: '5px', fontSize: '14px' }}>
                                    {errors.description}
                                </div>
                            )}
                        </div>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '20px',
                            marginBottom: '30px'
                        }}>
                            <div>
                                <label style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    marginBottom: '8px',
                                    color: '#2c3e50',
                                    fontWeight: '600'
                                }}>
                                    <FaTag /> Type *
                                </label>
                                <select
                                    name="type"
                                    value={recipe.type}
                                    onChange={handleInputChange}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: errors.type ? '1px solid #ff4444' : '1px solid #ddd',
                                        fontSize: '16px',
                                        transition: 'all 0.3s ease',
                                        backgroundColor: '#fff'
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
                                {errors.type && (
                                    <div style={{ color: '#ff4444', marginTop: '5px', fontSize: '14px' }}>
                                        {errors.type}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    marginBottom: '8px',
                                    color: '#2c3e50',
                                    fontWeight: '600'
                                }}>
                                    <FaTag /> Category *
                                </label>
                                <select
                                    name="category"
                                    value={recipe.category}
                                    onChange={handleInputChange}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        borderRadius: '8px',
                                        border: errors.category ? '1px solid #ff4444' : '1px solid #ddd',
                                        fontSize: '16px',
                                        transition: 'all 0.3s ease',
                                        backgroundColor: '#fff'
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
                                {errors.category && (
                                    <div style={{ color: '#ff4444', marginTop: '5px', fontSize: '14px' }}>
                                        {errors.category}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{ marginBottom: '30px' }}>
                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                marginBottom: '8px',
                                color: '#2c3e50',
                                fontWeight: '600'
                            }}>
                                <FaList /> Ingredients *
                            </label>
                            <textarea
                                name="ingredients"
                                value={recipe.ingredients}
                                onChange={handleInputChange}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: errors.ingredients ? '1px solid #ff4444' : '1px solid #ddd',
                                    minHeight: '150px',
                                    fontSize: '16px',
                                    resize: 'vertical',
                                    transition: 'all 0.3s ease',
                                    backgroundColor: '#fff'
                                }}
                                placeholder="Enter ingredients, one per line"
                                required
                            />
                            {errors.ingredients && (
                                <div style={{ color: '#ff4444', marginTop: '5px', fontSize: '14px' }}>
                                    {errors.ingredients}
                                </div>
                            )}
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowPreview(!showPreview)}
                                    style={{
                                        padding: '8px 16px',
                                        backgroundColor: '#f0f0f0',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    {showPreview ? 'Hide Preview' : 'Show Preview'}
                                </button>
                                <div style={{ fontSize: '12px', color: '#666' }}>
                                    {recipe.ingredients.split('\n').filter(line => line.trim()).length} ingredients
                                </div>
                            </div>
                            {showPreview && (
                                <div style={{
                                    marginTop: '10px',
                                    padding: '15px',
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: '8px',
                                    border: '1px solid #ddd'
                                }}>
                                    <h4 style={{ marginBottom: '10px', color: '#2c3e50' }}>Ingredients Preview:</h4>
                                    <ul style={{ margin: 0, paddingLeft: '20px' }}>
                                        {recipe.ingredients.split('\n')
                                            .filter(line => line.trim())
                                            .map((ingredient, index) => (
                                                <li key={index} style={{ marginBottom: '5px' }}>{ingredient.trim()}</li>
                                            ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        <div style={{ marginBottom: '30px' }}>
                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                marginBottom: '8px',
                                color: '#2c3e50',
                                fontWeight: '600'
                            }}>
                                <FaList /> Steps *
                            </label>
                            <textarea
                                name="steps"
                                value={recipe.steps}
                                onChange={handleInputChange}
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    borderRadius: '8px',
                                    border: errors.steps ? '1px solid #ff4444' : '1px solid #ddd',
                                    minHeight: '200px',
                                    fontSize: '16px',
                                    resize: 'vertical',
                                    transition: 'all 0.3s ease',
                                    backgroundColor: '#fff'
                                }}
                                placeholder="Enter steps, one per line"
                                required
                            />
                            {errors.steps && (
                                <div style={{ color: '#ff4444', marginTop: '5px', fontSize: '14px' }}>
                                    {errors.steps}
                                </div>
                            )}
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                                <button
                                    type="button"
                                    onClick={() => setShowPreview(!showPreview)}
                                    style={{
                                        padding: '8px 16px',
                                        backgroundColor: '#f0f0f0',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        transition: 'all 0.3s ease'
                                    }}
                                >
                                    {showPreview ? 'Hide Preview' : 'Show Preview'}
                                </button>
                                <div style={{ fontSize: '12px', color: '#666' }}>
                                    {recipe.steps.split('\n').filter(line => line.trim()).length} steps
                                </div>
                            </div>
                            {showPreview && (
                                <div style={{
                                    marginTop: '10px',
                                    padding: '15px',
                                    backgroundColor: '#f8f9fa',
                                    borderRadius: '8px',
                                    border: '1px solid #ddd'
                                }}>
                                    <h4 style={{ marginBottom: '10px', color: '#2c3e50' }}>Steps Preview:</h4>
                                    <ol style={{ margin: 0, paddingLeft: '20px' }}>
                                        {recipe.steps.split('\n')
                                            .filter(line => line.trim())
                                            .map((step, index) => (
                                                <li key={index} style={{ marginBottom: '5px' }}>{step.trim()}</li>
                                            ))}
                                    </ol>
                                </div>
                            )}
                        </div>

                        <div style={{ marginBottom: '30px' }}>
                            <label style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                marginBottom: '8px',
                                color: '#2c3e50',
                                fontWeight: '600'
                            }}>
                                <FaImage /> Recipe Image
                            </label>
                            <div style={{
                                border: '2px dashed #ddd',
                                borderRadius: '8px',
                                padding: '20px',
                                textAlign: 'center',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                backgroundColor: '#fff'
                            }}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    style={{ display: 'none' }}
                                    id="image-upload"
                                />
                                <label htmlFor="image-upload" style={{ cursor: 'pointer' }}>
                                    <FaImage style={{ fontSize: '24px', color: '#666', marginBottom: '10px' }} />
                                    <div style={{ color: '#666' }}>
                                        {image ? 'Click to change image' : 'Click to upload image (max 2MB)'}
                                    </div>
                                </label>
                            </div>
                            {previewUrl && (
                                <div style={{ marginTop: '15px', position: 'relative', display: 'inline-block' }}>
                                    <img
                                        src={previewUrl}
                                        alt="Recipe preview"
                                        style={{
                                            maxWidth: '200px',
                                            borderRadius: '8px',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setImage(null);
                                            setPreviewUrl('');
                                        }}
                                        style={{
                                            position: 'absolute',
                                            top: '-10px',
                                            right: '-10px',
                                            backgroundColor: '#ff4444',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '50%',
                                            width: '24px',
                                            height: '24px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            transition: 'all 0.3s ease'
                                        }}
                                    >
                                        <FaTimes />
                                    </button>
                                </div>
                            )}
                        </div>

                        <div style={{
                            display: 'flex',
                            gap: '15px',
                            justifyContent: 'center',
                            marginTop: '30px'
                        }}>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                style={{
                                    padding: '12px 24px',
                                    backgroundColor: isSubmitting ? '#ccc' : '#4CAF50',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: isSubmitting ? 'not-allowed' : 'pointer',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    transition: 'all 0.3s ease',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}
                            >
                                {isSubmitting ? (
                                    <>
                                        <FaSpinner className="fa-spin" />
                                        Updating...
                                    </>
                                ) : (
                                    'Update Recipe'
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate('/displayrecipe')}
                                style={{
                                    padding: '12px 24px',
                                    backgroundColor: '#666',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default EditRecipe; 