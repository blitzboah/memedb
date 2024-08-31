import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDropzone } from 'react-dropzone';

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
        const response = await axios.get(`http://localhost:8080/api/memes/${id}`);
        setMeme(response.data);
        setName(response.data.name);
        setDescription(response.data.description);
        setPreviewUrl(`data:${response.data.imageType};base64,${response.data.imageData}`);
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

  const updateMeme = async (formData) => {
    try {
      const response = await axios.put(`http://localhost:8080/api/memes/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Server response:', response.data);
      return response.data;
    } catch (error) {
      console.error("Failed to update:", error.response?.data || error.message);
      throw new Error("failed to update, try later");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    try {
      const formData = new FormData();
      
      const memeData = { id: parseInt(id), name, description };
      formData.append('meme', new Blob([JSON.stringify(memeData)], { type: 'application/json' }));
      
      if (image) {
        formData.append('imageFile', image);
      } else {
        formData.append('imageFile', new Blob(), 'dummy.txt');
      }

      const updatedMeme = await updateMeme(formData);
      setMeme(updatedMeme);
      setIsEditing(false);
      setError(null);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsUploading(false);
    }
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
  if (!meme) return <div className="text-center mt-8">meme not found</div>;

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
              nope
            </button>
          </div>
        )}
      </div>
      <Link to="/" className="text-blue-500 hover:underline">
        memeboard
      </Link>

      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
          <div className="bg-blue-10 border border-gray-200 rounded-lg p-6 w-96 max-h-[90vh] overflow-y-auto">
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <form onSubmit={handleSubmit} onPaste={handlePaste}>
              <div className="mb-4">
                <label className="block mb-2 text-white-700" htmlFor="name">name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2 border rounded text-gray-800"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-white-700" htmlFor="description">description</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2 border rounded text-gray-800"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block mb-2 text-white-700">upload image</label>
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer ${
                    isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                  }`}
                >
                  <input {...getInputProps()} />
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="max-w-full h-auto mb-2" />
                  ) : (
                    <p>drag & drop an image here, or click to select a file</p>
                  )}
                  <p className="text-sm text-gray-500 mt-2">you can also paste an image directly</p>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2 hover:bg-gray-400"
                  disabled={isUploading}
                >
                  cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  disabled={isUploading}
                >
                  {isUploading ? 'uploading...' : 'update'}
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