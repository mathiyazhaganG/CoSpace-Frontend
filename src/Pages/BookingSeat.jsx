import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

const BookingSeat = () => {
  const { id} = useParams();
  const spaceId = id; 
  const userId = useSelector((state) => state.user?._id);

  const [spaces, setSpaces] = useState([]);
  const [selectedSpace, setSelectedSpace] = useState(null);
  const [availableSeats, setAvailableSeats] = useState([]);
  const [formData, setFormData] = useState({
    spaceId: '',
    date: '',
    timeSlot: '',
    seatId: '',
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const res = await axios.get(`${process.env.BASE_API}/spaces`);
        setSpaces(res.data);
        if (spaceId) {
          const found = res.data.find((s) => s._id === spaceId);
          if (found) {
            setSelectedSpace(found);
            setFormData((prev) => ({ ...prev, spaceId: found._id }));
          } else {
            toast.error('Invalid space ID from URL');
          }
        }
      } catch (error) {
        setError('Unable to load spaces');
        console.error(error); 
      }
    };
    fetchSpaces();
  }, [spaceId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFetchSeats = async () => {
    setError(null);

    if (!formData.spaceId || !formData.date || !formData.timeSlot) {
      setError('Please select all required fields');
      return;
    }

    try {
      const res = await axios.get(`${process.env.BASE_API}/seats/available`, {
        params: {
          spaceId: formData.spaceId,
          date: formData.date,
          timeSlot: formData.timeSlot,
        },
        withCredentials: true,
      });

      setAvailableSeats(res.data);
      if (res.data.length === 0) {
        toast.error('No seats available for this slot.');
      }
    } catch {
      toast.error('Failed to fetch available seats.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.spaceId || !formData.date || !formData.timeSlot || !formData.seatId || !userId) {
      toast.error('All fields are required');
      return;
    }

    try {
      const res = await axios.post(
        `${process.env.BASE_API}/book`,
        { ...formData, userId },
        { withCredentials: true }
      );

      if (res.data.message.includes('already booked')) {
        toast.error(res.data.message);
      } else {
        toast.success(res.data.message);
        setFormData({ ...formData, seatId: '' });
        handleFetchSeats(); // refresh seats
      }
    } catch {
      toast.error('Booking failed. Try again.');
    }
  };

  const todayDate = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen pt-[100px] px-4 max-w-xl mx-auto pb-20">
      <h2 className="text-4xl font-bold text-center mb-8 text-gray-800 tracking-wide">Book Your Seat</h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 shadow">
          <p className="text-center font-semibold">{error}</p>
        </div>
      )}

      {/* Debugging log */}
      {selectedSpace ? (
        <div className="bg-blue-100 text-blue-800 px-4 py-6 rounded-lg mb-6 shadow text-center">
          <h1 className="text-5xl font-extrabold text-gray-900">{selectedSpace.spaceName}</h1>
          <p className="text-lg mt-2">{selectedSpace.location}</p>
        </div>
      ) : (
        <p className="text-center text-lg font-semibold text-gray-500">Loading space...</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {!selectedSpace && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Select Space</label>
            <select
              name="spaceId"
              value={formData.spaceId}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-lg shadow-sm"
              required
            >
              <option value="">-- Select --</option>
              {spaces.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.spaceName}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">Pick Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-lg shadow-sm"
            min={todayDate}
            required
          />
        </div>

        <div className="mb-4">
  <label className="block text-sm font-medium text-indigo-600 mb-2">Select Time Slot</label>
  <div className="relative">
    <select
      name="timeSlot"
      value={formData.timeSlot}
      onChange={handleChange}
      className="w-full border border-gray-300 px-4 py-3 rounded-lg shadow-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
      required
    >
      <option value="">-- Select a Time Slot --</option>
      <option value="9AM - 12PM">Morning: 9AM - 12PM</option>
      <option value="1PM - 4PM">Afternoon: 1PM - 4PM</option>
      <option value="5PM - 8PM">Evening: 5PM - 8PM</option>
      <option value="Full Day">Full Day (9AM - 8PM)</option>
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-indigo-600">
      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
      </svg>
    </div>
  </div>
</div>

        <button
          type="button"
          onClick={handleFetchSeats}
          className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition"
        >
          Check Available Seats
        </button>
        {availableSeats.length > 0 ? (
  <div className="mb-4">
    <label className="block text-sm font-medium text-indigo-600 mb-2">Available Seats</label>
    <div className="relative">
      <select
        name="seatId"
        value={formData.seatId}
        onChange={handleChange}
        className="w-full border border-gray-300 px-4 py-3 rounded-lg shadow-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
        required
      >
        <option value="">-- Select a Seat --</option>
        {availableSeats.map((seat) => (
          <option key={seat._id} value={seat._id}>
            Seat {seat.seatNumber}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-indigo-600">
        <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </div>
    </div>
  </div>
) : (
  <div className="mb-4">
    <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-4">
      <div className="flex items-center">
        <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">No Available Seats</h3>
          <div className="mt-2 text-sm text-yellow-700">
            <p>There are currently no seats available for the selected time slot. Please try selecting a different time or check back later.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
        >
          Confirm Booking
        </button>
      </form>
    </div>
  );
};

export default BookingSeat;
