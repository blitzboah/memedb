import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Memes from './components/Memes';
import Navbar from './components/Navbar';
import MemePage from './components/MemeId';


function App(){
  return(
    <Router>
      <div className="bg-gray-900 text-white min-h-screen">
        <Navbar />
        <div className="mt-5"></div>
        <Routes>
          <Route path="/" element={<Memes />} />
          <Route path="/memes/:id" element={<MemePage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App;
