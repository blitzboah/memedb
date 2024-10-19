import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllMemesFromIndexedDB } from '../../helpers/indexeddb-helper';

const Memes = () => {
  const [memes, setMemes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDataFromDB = async () => {
      try {
        const allMemes = await getAllMemesFromIndexedDB();
        setMemes(allMemes);
      } catch (error) {
        console.error("Error fetching data from IndexedDB", error);
        setError("Failed to fetch memes. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDataFromDB();
  }, []);

  if (isLoading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center text-red-500 mt-8">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {memes.length === 0 ? (
          <p className="col-span-full text-center">No memes found. Add some memes to get started!</p>
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

export default Memes;
