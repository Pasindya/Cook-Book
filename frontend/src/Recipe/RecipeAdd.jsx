import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

  // Handle form input changes
  const onInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'recipeImage' && files.length > 0) {
      const file = files[0];
      setRecipe({ ...recipe, recipeImage: file });

      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result);
      reader.readAsDataURL(file);
    } else {
      setRecipe({ ...recipe, [name]: value });
    }
  };

  // Submit the recipe form
  const onSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    let imageName = '';
    if (recipe.recipeImage) {
      const formData = new FormData();
      formData.append("file", recipe.recipeImage);

      try {
        const res = await axios.post("http://localhost:8080/recipes/recipeImg", formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        imageName = res.data;  // Assuming the backend returns the image filename
      } catch (err) {
        alert("Failed to upload image");
        console.error("Image upload error:", err.response ? err.response.data : err.message);
        setIsSubmitting(false);
        return;
      }
    }

    // Create the recipe object to send, with the image name if the image was uploaded
    const recipeData = { ...recipe, recipeImage: imageName };
    delete recipeData.recipeImage;  // Remove the file object as it's no longer needed

    try {
      // Submit the recipe form data
      await axios.post("http://localhost:8080/recipes", recipeData, {
        headers: { 'Content-Type': 'application/json' }
      });
      alert("Recipe added successfully!");
      navigate('/');  // Redirect to the home page or recipe list page
    } catch (err) {
      alert("Error saving recipe!");
      console.error("Error saving recipe:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <div>
        <label>Title</label>
        <input name="title" value={recipe.title} onChange={onInputChange} placeholder="Title" required />
      </div>

      <div>
        <label>Description</label>
        <textarea name="description" value={recipe.description} onChange={onInputChange} placeholder="Description" required />
      </div>

      <div>
        <label>Recipe Image</label>
        <input name="recipeImage" type="file" accept="image/*" onChange={onInputChange} />
        {previewImage && <img src={previewImage} alt="preview" style={{ maxWidth: '200px', maxHeight: '200px', marginTop: '10px' }} />}
      </div>

      <div>
        <label>Ingredients</label>
        <textarea name="ingredients" value={recipe.ingredients} onChange={onInputChange} placeholder="Ingredients" required />
      </div>

      <div>
        <label>Steps</label>
        <textarea name="steps" value={recipe.steps} onChange={onInputChange} placeholder="Steps" required />
      </div>

      <div>
        <label>Time</label>
        <input name="time" value={recipe.time} onChange={onInputChange} placeholder="Time" required />
      </div>

      <div>
        <label>Type</label>
        <input name="type" value={recipe.type} onChange={onInputChange} placeholder="Type" required />
      </div>

      <div>
        <label>Category</label>
        <input name="category" value={recipe.category} onChange={onInputChange} placeholder="Category" required />
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Submitting..." : "Add Recipe"}
      </button>
    </form>
  );
}

export default RecipeAdd;
