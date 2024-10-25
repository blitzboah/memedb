import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllMemesFromIndexedDB } from '../../helpers/indexeddb-helper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

const Memes = () => {
  const [memes, setMemes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copyStatus, setCopyStatus] = useState({ id: null, status: '' });

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
//this shit is complex than i thought initially
  const copyToClipboard = async (meme) => {
    try {
      setCopyStatus({ id: meme.id, status: 'copying' });

      // Create an image element to load the base64 data
      const img = new Image();
      img.src = `data:${meme.imageType};base64,${meme.imageData}`;

      // Wait for the image to load
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      // Create a canvas and draw the image
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      // Convert to PNG blob
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));

      // Check if the Clipboard API is supported
      if (!navigator.clipboard || !window.ClipboardItem) {
        throw new Error('Clipboard API not supported');
      }

      // Create a ClipboardItem with PNG type and write to clipboard
      const clipboardItem = new ClipboardItem({
        'image/png': blob
      });
      
      await navigator.clipboard.write([clipboardItem]);
      
      setCopyStatus({ id: meme.id, status: 'success' });
      setTimeout(() => setCopyStatus({ id: null, status: '' }), 2000);
    } catch (error) {
      console.error('Copy failed:', error);
      setCopyStatus({ id: meme.id, status: 'error' });
      setTimeout(() => setCopyStatus({ id: null, status: '' }), 2000);
    }
  };

  if (isLoading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center text-red-500 mt-8">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {memes.length === 0 ? (
          <p className="col-span-full text-center">no memes found. add some memes to get started!</p>
        ) : (
          memes.map((meme) => (
            <div key={meme.id} className="relative bg-gray-800 rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
              <Link to={`/memes/${meme.id}`}>
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
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  copyToClipboard(meme);
                }}
                className={`absolute top-2 right-2 p-2 rounded-lg transition-colors ${
                  copyStatus.id === meme.id
                    ? copyStatus.status === 'success'
                      ? 'bg-green-600 hover:bg-green-700'
                      : copyStatus.status === 'error'
                      ? 'bg-red-600 hover:bg-red-700'
                      : 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
                style={{ width: '40px', height: '40px' }}
              >
                <FontAwesomeIcon 
                  icon={faCopy} 
                  size="lg" 
                  color="white" 
                  className={copyStatus.id === meme.id && copyStatus.status === 'copying' ? 'animate-pulse' : ''}
                />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Memes;
