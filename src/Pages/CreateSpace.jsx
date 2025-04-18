import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const CreateSpace = () => {
  const [formData, setFormData] = useState({
    spaceName: '',
    location: '',
    amenities: '',
    description: '',
    imageUrl: '',
    TotalSeats: 0,
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formattedData = {
      ...formData,
      amenities: formData.amenities.split(',').map((item) => item.trim()),
      images: [formData.imageUrl], 
    };

    try {
      await axios.post(`${process.env.BASE_API}/CreateSpace`, formattedData,{withCredentials: true});
      toast.success('Space created successfully!');
      setFormData({
        spaceName: '',
        location: '',
        amenities: '',
        description: '',
        imageUrl: '',
        TotalSeats: 0,
      });
    } catch (error) {
      toast.error('Failed to create space!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 px-4 max-w-3xl mx-auto pb-20">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Create New Space</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Space Name</label>
          <input
            type="text"
            name="spaceName"
            value={formData.spaceName}
            onChange={handleChange}
            className="mt-1 w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            className="mt-1 w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Amenities <span className="text-gray-500 text-xs">(Comma separated)</span>
          </label>
          <input
            type="text"
            name="amenities"
            value={formData.amenities}
            onChange={handleChange}
            className="mt-1 w-full px-4 py-2 border rounded-md"
            placeholder="WiFi, Parking, AC"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 w-full px-4 py-2 border rounded-md"
            rows={3}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Image URL</label>
          <input
            type="url"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className="mt-1 w-full px-4 py-2 border rounded-md"
            placeholder="https://example.com/image.jpg"
            required
          />
        </div>

        {formData.imageUrl && (
          <div className="mt-2">
            <p className="text-sm text-gray-600 mb-1">Image Preview:</p>
            <img
              src={formData.imageUrl}
              alt="Preview"
              className="w-full max-h-64 object-cover rounded-lg border"
              onError={(e) => (e.target.style.display = 'none')}
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Total Seats</label>
          <input
            type="number"
            name="TotalSeats"
            value={formData.TotalSeats}
            onChange={handleChange}
            className="mt-1 w-full px-4 py-2 border rounded-md"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 text-white rounded-md ${
            loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {loading ? 'Creating...' : 'Create Space'}
        </button>
      </form>

      <ToastContainer />
    </div>
  );
};

export default CreateSpace;
