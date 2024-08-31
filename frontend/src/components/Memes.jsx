import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Memes = () => {
  const [memes, setMemes] = useState([]);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/memes");
        setMemes(response.data);
      } catch (error) {
        console.error("error fetching data", error);
        setIsError(true);
      }
    };
    fetchData();
  }, []);

  if (isError) {
    return <div className="text-center text-red-500 mt-8">erro fetching memes</div>;
  }

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

export default Memes;