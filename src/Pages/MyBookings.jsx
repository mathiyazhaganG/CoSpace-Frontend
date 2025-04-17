import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { CalendarDays, Clock, MapPin, Building2, Star } from 'lucide-react';

const MyBookings = () => {
  const { id } = useParams();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${process.env.BASE_API}/user/${id}`, {
        withCredentials: true,
      });
      setBookings(res.data);
    } catch (error) {
      setError('Failed to fetch bookings. Please try again later.');
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchBookings();
    }
  }, [id]);

  const handleCancel = async (bookingId) => {
    try {
      await axios.delete(`${process.env.BASE_API}/cancel/${bookingId}`, {
        withCredentials: true,
      });
      setBookings((prev) => prev.filter((b) => b._id !== bookingId));
    } catch (err) {
      setError('Failed to cancel booking. Please try again later.');
      console.error('Error cancelling booking:', err);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen pt-[100px] flex justify-center items-center">
        <p className="text-center text-lg text-gray-600">Loading bookings...</p>
      </div>
    );

  return (
    <div className="min-h-screen pt-[100px] px-4 max-w-6xl mx-auto pb-20">
      <h2 className="text-4xl font-bold text-gray-800 mb-10 text-center">My Bookings</h2>
      {error && <p className="text-center text-red-500 mb-6">{error}</p>}

      {bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center mt-16 space-y-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-20 w-20 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p className="text-xl font-semibold text-gray-700">No bookings yet.</p>
          <p className="text-sm text-gray-500">
            Start exploring and book your ideal workspace today!
          </p>
          <Link
            to="/home"
            className="bg-blue-600 text-white px-6 py-3 rounded-full shadow hover:bg-blue-700 transition duration-300"
          >
            Explore Workspaces
          </Link>
        </div>
      ) : (
        <div className="grid gap-8">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white p-6 shadow-lg hover:shadow-xl rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center transition-all duration-300"
            >
              <div className="flex items-start sm:items-center gap-6">
                <img
                  src={booking.space?.images?.[0] || 'https://via.placeholder.com/100'}
                  alt={booking.space?.spaceName || 'Booking Image'}
                  className="w-28 h-28 object-cover rounded-xl"
                />
                <div className="space-y-1">
                  <h3 className="text-xl font-semibold text-gray-800">
                    Seat: {booking.seat?.seatNumber}
                  </h3>
                  <p className="flex items-center text-sm text-gray-600 gap-2">
                    <CalendarDays size={16} /> Date: {booking.date}
                  </p>
                  <p className="flex items-center text-sm text-gray-600 gap-2">
                    <Clock size={16} /> Time Slot: {booking.timeSlot}
                  </p>
                  <p className="flex items-center text-sm text-gray-600 gap-2">
                    <Building2 size={16} /> Space: {booking.space?.spaceName || 'N/A'}
                  </p>
                  <p className="flex items-center text-sm text-gray-600 gap-2">
                    <MapPin size={16} /> Location: {booking.space?.location || 'N/A'}
                  </p>
                  <p className="flex items-center text-sm text-gray-600 gap-2">
                    <Star size={16} /> Amenities: {booking.space?.amenities?.join(', ') || 'N/A'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleCancel(booking._id)}
                className="mt-4 sm:mt-0 sm:ml-6 bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 transition duration-300"
              >
                Cancel
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
