import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function MemePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meme, setMeme] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  useEffect(() => {
    const fetchMeme = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`http://localhost:8080/api/memes/${id}`);
        setMeme(response.data);
      } catch (error) {
        console.error("error fetching meme:", error);
        setError("failed to load, try later!");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMeme();
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/memes/${id}`);
      navigate('/');
    } catch (error) {
      console.error("error deleting meme:", error);
      setError("failed to delete, try later!");
    }
  };

  if (isLoading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;
  if (!meme) return <div className="text-center mt-8">meme not found</div>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{meme.name}</h1>
      {meme.imageData && meme.imageType && (
        <img 
          src={`data:${meme.imageType};base64,${meme.imageData}`}
          alt={meme.name} 
          className="w-full h-auto mb-4 rounded-lg shadow-lg" 
        />
      )}
      <p className="mt-2 text-lg mb-6">{meme.description}</p>
      <div className="flex space-x-4 mb-6">
        <Link to={`/update/${id}`} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
          update
        </Link>
        {!showDeleteConfirmation ? (
          <button
            onClick={() => setShowDeleteConfirmation(true)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
          >
            delete?
          </button>
        ) : (
          <div className="flex items-center space-x-2">
            <span className="text-red-500">bet?</span>
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
            >
              yessir
            </button>
            <button
              onClick={() => setShowDeleteConfirmation(false)}
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
            >
              nope
            </button>
          </div>
        )}
      </div>
      <Link to="/" className="text-blue-500 hover:underline">
        memeboard
      </Link>
    </div>
  );
}

export default MemePage;