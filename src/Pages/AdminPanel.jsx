import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Spaces from '../components/Spaces';

const AdminPanel = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch bookings from the API
    const fetchBookings = async () => {
      try {
        const response = await axios.get(`${process.env.BASE_API}/bookings`, { withCredentials: true });
        setBookings(response.data);
        setLoading(false);
      } catch (error) {
        setError("Failed to fetch bookings");
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-xl font-semibold text-gray-800">Loading bookings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-xl font-semibold text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 px-6">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-gray-800 tracking-wide">Admin Panel</h1>

      {/* Table to display bookings */}
      <div className="overflow-x-auto shadow-lg rounded-lg bg-white">
        <table className="min-w-full table-auto border-separate border-spacing-0">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="py-4 px-6 border-b text-left text-sm font-medium">Booking Date</th>
              <th className="py-4 px-6 border-b text-left text-sm font-medium">Time Slot</th>
              <th className="py-4 px-6 border-b text-left text-sm font-medium">User</th>
              <th className="py-4 px-6 border-b text-left text-sm font-medium">Seat</th>
              <th className="py-4 px-6 border-b text-left text-sm font-medium">Space</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr
                key={booking._id}
                className="hover:bg-gray-50 transition duration-200 ease-in-out"
              >
                <td className="py-4 px-6 border-b text-sm text-gray-700">{new Date(booking.date).toLocaleDateString('en-GB')}</td>
                <td className="py-4 px-6 border-b text-sm text-gray-700">{booking.timeSlot}</td>
                <td className="py-4 px-6 border-b text-sm text-gray-700">{booking.user.name}</td>
                <td className="py-4 px-6 border-b text-sm text-gray-700">{booking.seat.seatNumber}</td>
                <td className="py-4 px-6 border-b text-sm text-gray-700">{booking.space.spaceName}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <section id="spaces" className="py-16 bg-gray-100">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-800">Our Workspaces</h2>
        </div>
        <div className="px-4 md:px-12">
          <Spaces />
        </div>
      </section>
    </div>
  );
};

export default AdminPanel;
