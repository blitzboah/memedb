import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { getAllMemesFromIndexedDB } from '../../helpers/indexeddb-helper';

function SearchResults() {
  const [memes, setMemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search).get('keyword');

    const fetchMemesFromDB = async () => {
      try {
        const allMemes = await getAllMemesFromIndexedDB();

        const filteredMemes = allMemes.filter((meme) =>
          meme.name?.toLowerCase().includes(query.toLowerCase()) ||
          meme.description?.toLowerCase().includes(query.toLowerCase())
        );

        setMemes(filteredMemes);
      } catch (err) {
        setError(`Failed to fetch memes: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchMemesFromDB();
    } else {
      setLoading(false);
    }
  }, [location.search]);

  if (loading) return <p className="text-center mt-8">Loading...</p>;
  if (error) return <p className="text-center mt-8 text-red-500">Error: {error}</p>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {memes.length === 0 ? (
          <p className="col-span-full text-center">No memes found for this search.</p>
        ) : (
          memes.map((meme) => (
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
          ))
        )}
      </div>
    </div>
  );
}

export default SearchResults;
