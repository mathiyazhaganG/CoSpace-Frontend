import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'; // Changed from 'react-router'
import axios from 'axios';
import { adduser } from '../utils/userSlice'; // Import your Redux action
import { Mail, Lock, User, Coffee, ArrowRight, Check, AlertCircle } from 'lucide-react';
import validator from 'validator';


function CoSpaceAuth() {
  const dispatch = useDispatch(); // Redux dispatch
  const navigate = useNavigate(); // Initialize useNavigate

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  // State for handling loading and response
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const LOGIN_ENDPOINT = `${process.env.BASE_API}/user/login`;
  const SIGNUP_ENDPOINT = `${process.env.BASE_API}/user/register`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    // Perform validation only for Sign Up mode
    if (!isLogin) {
      if (!validator.isEmail(email)) {
        setError('Please enter a valid email address.');
        setIsLoading(false);
        return;
      }

      if (!validator.isLength(password, { min: 6 })) {
        setError('Password must be at least 6 characters long.');
        setIsLoading(false);
        return;
      }

      if (!validator.isLength(name, { min: 1 })) {
        setError('Name is required.');
        setIsLoading(false);
        return;
      }
    }

    try {
      let response;

      // Configure Axios to include cookies
      axios.defaults.withCredentials = true;

      if (isLogin) {
        // Login request
        response = await axios.post(LOGIN_ENDPOINT, {
          email,
          password,
        });

        // Navigate based on user role
        const userRole = response.data.user.role; // Corrected access to user role
        if (userRole === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        // Signup request
        response = await axios.post(SIGNUP_ENDPOINT, {
          name,
          email,
          password,
        });
      }

      // Handle successful authentication
      const data = response.data;

      // Dispatch user data to Redux store
      localStorage.setItem('user', JSON.stringify(data.user));
      dispatch(adduser(data.user));

      setSuccess(isLogin ? 'Login successful!' : 'Account created successfully!');

    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setSuccess('');
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Side - Image & Branding */}
      <div className="hidden md:flex md:w-1/2 bg-indigo-600 flex-col justify-between p-12 text-white">
        <div>
          <div className="flex items-center mb-8">
            <Coffee size={32} className="mr-3" />
            <h1 className="text-3xl font-bold">CoSpace</h1>
          </div>
          <p className="text-xl font-medium mb-4">Your perfect workspace awaits</p>
          <p className="text-indigo-100">
            Join our community of entrepreneurs, freelancers, and remote workers.
            Discover flexible workspaces designed for productivity and collaboration.
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-start">
            <div className="bg-indigo-500 p-2 rounded-full mr-4">
              <Check size={16} />
            </div>
            <p>24/7 access to premium workspaces</p>
          </div>
          <div className="flex items-start">
            <div className="bg-indigo-500 p-2 rounded-full mr-4">
              <Check size={16} />
            </div>
            <p>High-speed internet and modern amenities</p>
          </div>
          <div className="flex items-start">
            <div className="bg-indigo-500 p-2 rounded-full mr-4">
              <Check size={16} />
            </div>
            <p>Community events and networking opportunities</p>
          </div>
        </div>
      </div>

      {/* Right Side - Authentication Form */}
      <div className="w-full md:w-1/2 flex justify-center items-center p-6">
        <div className="w-full max-w-md">
          <div className="md:hidden flex items-center justify-center mb-8">
            <Coffee size={28} className="mr-2 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">CoSpace</h1>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            {isLogin ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="text-gray-600 mb-8">
            {isLogin ? 'Sign in to access your workspace' : 'Join our co-working community'}
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 flex items-center">
              <AlertCircle className="mr-2" size={20} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-6 flex items-center">
              <Check className="mr-2" size={20} />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="pl-10 block w-full rounded-lg border border-gray-300 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    placeholder="John Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 block w-full rounded-lg border border-gray-300 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 block w-full rounded-lg border border-gray-300 py-3 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder={isLogin ? 'Enter your password' : 'Create a strong password'}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className={`flex items-center justify-center w-full rounded-lg bg-indigo-600 py-3 px-4 text-white font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                  isLoading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    {isLogin ? 'Sign In' : 'Create Account'}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "Don't have an account?" : 'Already have an account?'}
              <button
                type="button"
                onClick={toggleMode}
                className="ml-1 font-medium text-indigo-600 hover:text-indigo-500"
              >
                {isLogin ? 'Sign up' : 'Sign in'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CoSpaceAuth;