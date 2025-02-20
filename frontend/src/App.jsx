import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Memes from './components/Memes';
import Navbar from './components/Navbar';
import MemePage from './components/MemeId';
import MemeSearch from './components/MemeSearch'
import { Analytics } from "@vercel/analytics/react";

function App() {
  return (
    <Router>
      <div className="text-white min-h-screen">
        <Navbar />
        <div className="mt-5"></div>
        <Routes>
          <Route path="/" element={<Memes />} />
          <Route path="/memes/:id" element={<MemePage />} />
          <Route path="/search" element={<MemeSearch />} />
        </Routes>
        <Analytics />
      </div>
    </Router>
  );
}

export default App;

