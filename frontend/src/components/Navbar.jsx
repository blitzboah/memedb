import React, { useState } from 'react';
import UploadMemeModal from './UploadMemeModal'; // Import the modal component

function Navbar() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <nav className="bg-gray-800 p-4 flex justify-between items-center w-full">
        <div className="flex items-center">
          <img
            src=".././memeboard.png"
            alt="Logo"
            className="h-10 w-40"
          />
        </div>
  
        <div className="flex items-center">
          <a
            href="http://dingboard.com/"
            className="text-white text-lg font-medium hover:text-gray-300 mr-4"
          >
            Edit
          </a>
          <button
            onClick={openModal}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Upload
          </button>
        </div>
      </nav>
      {isModalOpen && <UploadMemeModal closeModal={closeModal} />}
    </>
  );
}

export default Navbar;