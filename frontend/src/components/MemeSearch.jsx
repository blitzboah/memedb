import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';

function SearchResults() {
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const location = useLocation();
  
  useEffect(() => {
    const query = new URLSearchParams(location.search).get('keyword');
    
    if (query) {
      axios.get(`http://localhost:8080/api/memes/search?keyword=${query}`)
        .then(response => {
          setMemes(response.data);
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [location.search]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {memes.map((meme) => (
          <Link 
            key={meme.id} 
            to={`/memes/${meme.id}`}
            className="bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105"
          >
            <div className="aspect-w-1 aspect-h-1 w-full">
              <img
                src={`data:${meme.imageType};base64,${meme.imageData}`}
                alt={meme.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-2 line-clamp-2">{meme.name}</h2>
              <p className="text-gray-400 text-sm italic truncate">- {meme.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default SearchResults;
