import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Home from './pages/Home';
import RecipeAdd from './Recipe/RecipeAdd';
import Displayrecipe from './Recipe/Displayrecipe';
import EditRecipe from './Recipe/EditRecipe';
import AddChallengers from './Challengers/AddChallengers';
import Challengers from './Challengers/Challengers';
import DisplayChallengers from './Challengers/DisplayChallengers';
import UpdateChallenge from './Challengers/UpdateChallenge';
import Profile from './pages/Profile';
import AllRecipes from './pages/AllRecipes';

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipeAdd" element={<RecipeAdd />} />
        <Route path="/displayrecipe" element={<Displayrecipe />} />
        <Route path="/recipes/edit/:id" element={<EditRecipe />} />
        <Route path="/challengers" element={<Challengers />} />
        <Route path="/addchallengers" element={<AddChallengers />} />
        <Route path="/displaychallengers" element={<DisplayChallengers />} />
        <Route path="/updatechallenge/:id" element={<UpdateChallenge />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/all-recipes" element={<AllRecipes />} />
      </Routes>
    </>
  );
}

export default App;