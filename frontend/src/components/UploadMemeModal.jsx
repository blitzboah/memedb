import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import '../App.css';

function UploadMemeModal({ closeModal, onMemeAdded }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    handleImageUpload(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: 'image/*',
    multiple: false
  });

  const handleImageUpload = (file) => {
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handlePaste = (e) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile();
        handleImageUpload(file);
        break;
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUploading(true);
    setError(null);
  
    if (!name || !description || !image) {
      setError('fill all the fields.');
      setIsUploading(false);
      return;
    }
  
    const formData = new FormData();
    formData.append('meme', new Blob([JSON.stringify({ name, description })], { type: 'application/json' }));
    formData.append('imageFile', image);
  
    console.log('submitting formData:', formData);
  
    try {
      const response = await axios.post('http://localhost:8080/api/memes', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Meme added successfully:', response.data);
      if (onMemeAdded) {
        onMemeAdded(response.data);
      }
      closeModal();
    } catch (error) {
      console.error('Error adding meme:', error);
      setError(error.response?.data || 'Failed to add meme. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
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
              <p className="text-sm text-white-500 mt-2">you can also paste an image directly</p>
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
              disabled={!image || isUploading}
            >
              {isUploading ? 'uploading...' : 'upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UploadMemeModal;
