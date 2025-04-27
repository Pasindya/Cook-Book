import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RecipeAdd from './Recipe/RecipeAdd';
import Displayrecipe from './Recipe/Displayrecipe';
import AddChallengers from './Challengers/AddChallengers';
import Challengers from './Challengers/challengers';
import DisplayChallengers from './Challengers/DisplayChallengers';
import UpdateChallenge from './Challengers/UpdateChallenge';




function App() {
  return (
    <Routes>
      
      <Route path="/" element={<Home />} />
      <Route path="/recipeAdd" element={<RecipeAdd />} />
      <Route path="/displayrecipe" element={<Displayrecipe />} />
      <Route path="/challengers" element={<Challengers />} />
      <Route path="/addchallengers" element={<AddChallengers />} />
      <Route path="/displaychallengers" element={<DisplayChallengers />} />
      <Route path="/updatechallenge/:id" element={<UpdateChallenge />} />
      
    </Routes>
  );
}

export default App;