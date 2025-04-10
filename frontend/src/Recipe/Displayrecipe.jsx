import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';

function DisplayRecipe() {
    const [recipes, setRecipes] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        loadRecipes();
    }, []);

    const loadRecipes = async () => {
        try {
            const result = await axios.get(`http://localhost:8080/recipes`);
            setRecipes(result.data);
        } catch (error) {
            console.error("Error loading recipes:", error);
        }
    };

    return (
        <div>
            <Navbar />
            <h1>Recipe List</h1>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Image</th>
                        <th>Description</th>
                        <th>Ingredients</th>
                        <th>Steps</th>
                        <th>Time</th>
                        <th>Type</th>
                    </tr>
                </thead>
                <tbody>
                    {recipes.map((recipe, index) => (
                        <tr key={index}>
                            <td>{recipe.id}</td>
                            <td>{recipe.title}</td>
                            <td>
                                <img 
                                    src={`http://localhost:8080/uploads/${recipe.recipeImage}`}
                                    alt={recipe.title} 
                                    width="50" 
                                    height="50"
                                />
                            </td>
                            <td>{recipe.description}</td>
                            <td>{recipe.ingredients}</td>
                            <td>{recipe.steps}</td>
                            <td>{recipe.time}</td>
                            <td>{recipe.type}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default DisplayRecipe;