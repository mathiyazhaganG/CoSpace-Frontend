import React, { useEffect } from 'react';
import { BrowserRouter, Route, Routes, Navigate, Outlet } from 'react-router-dom';
import './index.css';
import Error from './components/Error';
import Home from './Pages/Home';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CoSpaceAuth from './Pages/CoSpaceAuth';
import { Provider, useDispatch } from 'react-redux';
import store from './utils/appstore';
import { adduser } from './utils/userSlice'; 
import MyBookings from './Pages/MyBookings';
import BookingSeat from './Pages/BookingSeat';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminPanel from './Pages/AdminPanel';
import CreateSpace from './Pages/CreateSpace';
const ProtectedRoute = ({ children }) => {
  // Check for the presence of a cookie (e.g., authToken)
  const hasAuthCookie = document.cookie.includes('token=');

  // Redirect to auth if the cookie is not present
  if (!hasAuthCookie) {
    return <Navigate to="/auth" />;
  }

  return children;
};

const AppLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
	  <ToastContainer position="top-center" autoClose={3000} />
    </>
  );
};

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Load user data from localStorage and dispatch to Redux store
    const userData = JSON.parse(localStorage.getItem('user'));
    if (userData) {
      dispatch(adduser(userData));
    }
  }, [dispatch]);

  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          {/* Auth route */}
          <Route path="/auth" element={<CoSpaceAuth />} />

          {/* Protected routes under the main layout */}
          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/home" element={<Home />} errorElement={<Error />} />
			<Route path="/user/:id" element={<MyBookings/>} errorElement={<Error />} />
			<Route path="/book/:id" element={< BookingSeat/>} errorElement={<Error />} />
            <Route path="/" element={<Navigate to="/home" />} />
			<Route path="/admin" element={<AdminPanel/>}/>
			<Route path="/admin/createSpace" element={<CreateSpace/>}/>
          </Route>

          {/* Global error handling */}
          <Route path="*" element={<Error />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
};

export default App;