import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { saveMemeToIndexedDB, getMemeFromIndexedDB, deleteMemeFromIndexedDB } from '../../helpers/indexeddb-helper';

function MemePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meme, setMeme] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchMeme = async () => {
      try {
        setIsLoading(true);
        const memeData = await getMemeFromIndexedDB(id);
        if (!memeData) {
          throw new Error('Meme not found in IndexedDB');
        }
        setMeme(memeData);
        setName(memeData.name);
        setDescription(memeData.description);
        setPreviewUrl(`data:${memeData.imageType};base64,${memeData.imageData}`);
      } catch (error) {
        console.error("Error fetching meme:", error);
        setError("Failed to load, try later!");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMeme();
  }, [id]);

  const handleDelete = async () => {
    try {
      await deleteMemeFromIndexedDB(id);
      navigate('/');
    } catch (error) {
      console.error("Error deleting meme:", error);
      setError("Failed to delete, try later!");
    }
  };

  const updateMeme = async (memeData) => {
    try {
      await saveMemeToIndexedDB(memeData);
      navigate('/');
    } catch (error) {
      console.error("Failed to update:", error.message);
      throw new Error("Failed to update, try later");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      const updatedMeme = {
        id: parseInt(id),
        name,
        description,
        imageType: image ? image.type : meme.imageType,
        imageData: image ? await toBase64(image) : meme.imageData
      };
      await updateMeme(updatedMeme);
      setIsEditing(false);
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = (error) => reject(error);
    });
  };

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handlePaste = (e) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        setImage(blob);
        setPreviewUrl(URL.createObjectURL(blob));
      }
    }
  };

  const closeModal = () => {
    setIsEditing(false);
    setName(meme.name);
    setDescription(meme.description);
    setPreviewUrl(`data:${meme.imageType};base64,${meme.imageData}`);
    setImage(null);
  };

  if (isLoading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-red-500 text-center mt-8">{error}</div>;
  if (!meme) return <div className="text-center mt-8">Meme not found</div>;

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{meme.name}</h1>
      <img
        src={`data:${meme.imageType};base64,${meme.imageData}`}
        alt={meme.name}
        className="w-full h-auto mb-4 rounded-lg shadow-lg"
      />
      <p className="mt-2 text-lg mb-6">{meme.description}</p>
      <div className="flex space-x-4 mb-6">
        <button onClick={() => setIsEditing(true)} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
          edit
        </button>
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
              no
            </button>
          </div>
        )}
      </div>
      <Link to="/" className="text-blue-500 hover:underline">
        back to memedb
      </Link>

      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
          <div className="border border-gray-200 rounded-lg p-6 w-96 max-h-[90vh] overflow-y-auto">
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} onPaste={handlePaste}>
              <div className="mb-4">
                <label className="block mb-2 text-gray-700" htmlFor="name">name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800"
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-gray-700" htmlFor="description">description</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-800"
                />
              </div>
              <div {...getRootProps()} className="border-dashed border-2 p-4 rounded-lg mb-4 cursor-pointer">
                <input {...getInputProps()} />
                {isDragActive ? (
                  <p className="text-center text-gray-500">drop the files here ...</p>
                ) : (
                  <p className="text-center text-gray-500">drag and drop an image here, or click to select files</p>
                )}
              </div>
              {previewUrl && (
                <img src={previewUrl} alt="Preview" className="w-full h-auto mb-4 rounded-lg shadow-lg" />
              )}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
                >
                  cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                  {isUploading ? 'saving...' : 'save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MemePage;
