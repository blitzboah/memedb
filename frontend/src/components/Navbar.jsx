import React, { useState } from 'react';
import UploadMemeModal from './UploadMemeModal';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?keyword=${searchQuery}`);
    }
  };

  return (
    <>
      <nav className="bg-gray-800 p-4 flex justify-between items-center w-full">
        <Link to="/">
          <div className="flex items-center">
            <img
              src=".././memeboard.png"
              alt="Logo"
              className="h-10 w-40"
            />
          </div>
        </Link>
        <div className="flex items-center">
          <form onSubmit={handleSearch} className="mr-4">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="search"
              className="text-black px-3 py-2 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              search
            </button>
          </form>
          <a
            href="http://dingboard.com/"
            className="text-white text-lg font-medium hover:text-gray-300 mr-4"
          >
            edit
          </a>
          <button
            onClick={openModal}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            add
          </button>
        </div>
      </nav>
      {isModalOpen && <UploadMemeModal closeModal={closeModal} />}
    </>
  );
}

export default Navbar;