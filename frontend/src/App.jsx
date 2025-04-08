import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RecipeAdd from './Recipe/RecipeAdd';


function App() {
  return (
    <Routes>
      
      <Route path="/" element={<Home />} />
      <Route path="/recipeAdd" element={<RecipeAdd />} />
    </Routes>
  );
}

export default App;