import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RecipeAdd from './Recipe/RecipeAdd';
import Displayrecipe from './Recipe/Displayrecipe';
import Comment from './pages/Comment';




function App() {
  return (
    <Routes>
      
      <Route path="/" element={<Home />} />
      <Route path="/recipeAdd" element={<RecipeAdd />} />
      <Route path="/displayrecipe" element={<Displayrecipe />} />
      <Route path=":recipeId/comments" element={<Comment />} /> // Recipe comments
      
    </Routes>
  );
}

export default App;