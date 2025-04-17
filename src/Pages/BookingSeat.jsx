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
            console.log('Found Space:', found); 
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

        <div>
          <label className="block text-sm font-medium text-gray-700">Time Slot</label>
          <select
            name="timeSlot"
            value={formData.timeSlot}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded-lg shadow-sm"
            required
          >
            <option value="">-- Select --</option>
            <option value="9AM - 12PM">9AM - 12PM</option>
            <option value="1PM - 4PM">1PM - 4PM</option>
            <option value="5PM - 8PM">5PM - 8PM</option>
          </select>
        </div>

        <button
          type="button"
          onClick={handleFetchSeats}
          className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition"
        >
          Check Available Seats
        </button>

        {availableSeats.length > 0 && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Available Seats</label>
            <select
              name="seatId"
              value={formData.seatId}
              onChange={handleChange}
              className="w-full border px-4 py-2 rounded-lg shadow-sm"
              required
            >
              <option value="">-- Select --</option>
              {availableSeats.map((seat) => (
                <option key={seat._id} value={seat._id}>
                  Seat {seat.seatNumber}
                </option>
              ))}
            </select>
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
