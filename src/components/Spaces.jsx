import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function Spaces() {
	const user = useSelector((state) => state.user);
  const [spaces, setSpaces] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        const res = await axios.get(`${process.env.BASE_API}/spaces`, { withCredentials: true });
        setSpaces(res.data);
      } catch (error) {
        console.error('Error fetching spaces:', error);
      }
    };
    fetchSpaces();
  }, []);

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {spaces.map((space) => (
          <div
            key={space._id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all"
          >
            {space.images?.[0] && (
              <img
                src={space.images[0]}
                alt={space.spaceName}
                className="w-full h-40 object-cover"
              />
            )}
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800">{space.spaceName}</h3>
              <p className="text-sm text-gray-500">{space.location}</p>
              <p className="text-sm mt-2 text-gray-700 line-clamp-3">{space.description}</p>

              {/* Amenities */}
              <div className="flex flex-wrap gap-2 mt-3">
                {space.amenities?.map((amenity, i) => (
                  <span
                    key={i}
                    className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full"
                  >
                    {amenity}
                  </span>
                ))}
              </div>

			  {user?.role !== 'admin' && (
                <button
                  onClick={() => navigate(`/book/${space._id}`)} 
                  className="mt-4 w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700"
                >
                  Book a Seat
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Spaces;
