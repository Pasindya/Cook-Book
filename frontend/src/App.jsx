import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RecipeAdd from './Recipe/RecipeAdd';
import Displayrecipe from './Recipe/Displayrecipe';




function App() {
  return (
    <Routes>
      
      <Route path="/" element={<Home />} />
      <Route path="/recipeAdd" element={<RecipeAdd />} />
      <Route path="/displayrecipe" element={<Displayrecipe />} />
      
    </Routes>
  );
}

export default App;