import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { removeuser } from "../utils/userSlice";

export default function SimpleCoSpaceLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    dispatch(removeuser());
    navigate("/auth");
  };

  return (
    <div className="font-sans bg-white">
      <nav className="fixed top-0 left-0 w-full z-50 bg-white shadow-sm py-4 px-6">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          {(user?.role=='admin')?<Link to="/admin" className="text-3xl font-bold text-blue-600">
            Co<span className="text-gray-800">Space</span>
          </Link>:<Link to="/home" className="text-3xl font-bold text-blue-600">
            Co<span className="text-gray-800">Space</span>
          </Link>}

          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                <p className="text-gray-600 hover:text-blue-600">
                  Hi, {user?.name}
                </p>
               {(user?.role=='admin')?<Link
                  to={"/admin/createSpace"} 
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                  Create Space
                </Link>:<Link
                  to={`/user/${user._id}`} 
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                >
                   My Bookings
                </Link> }
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <a
                href="/auth"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Login
              </a>
            )}
          </div>

          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 px-4 bg-gray-50 rounded-lg">
            <div className="flex flex-col space-y-3">
              {user ? (
                <>
                  <p className="text-gray-600 hover:text-blue-600">
                    Hi, {user?.name}
                  </p>
                  {(user?.role=='admin')?<Link
                    to={"/admin/createSpace"} 
                    className="block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-center"
                  >
                  Create Space
                  </Link>:
                  <Link
                    to={`/user/${user._id}`} 
                    className="block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-center"
                  >
                    My Bookings
                  </Link>}
                  <button
                    onClick={handleLogout}
                    className="block bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-center"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <a
                  href="/auth"
                  className="block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 text-center"
                >
                  Login
                </a>
              )}
            </div>
          </div>
        )}
      </nav>
    </div>
  );
}