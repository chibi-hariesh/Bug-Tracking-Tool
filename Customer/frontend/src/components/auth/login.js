// login.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import your image
// import bannerImage from './banner.jpg';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // eslint-disable-next-line
  const [showForm, setShowForm] = useState(false); // State to control form visibility
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/auth/login', { email, password });
      if (response.status === 200) {
        const { customer } = response.data;
        localStorage.setItem('customerId', customer.customer_id);
        localStorage.setItem('customerName', customer.customer_name);
        localStorage.setItem('customerEmail', customer.email);
        toast.success('Login successful!', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        setTimeout(() => {
          navigate('/home');
        }, 2000);
      }
    } catch (error) {
      console.error('Login failed', error);
      toast.error('Login failed. Please check your credentials.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  useEffect(() => {
    // Show the form with animation when component mounts
    setShowForm(true);
  }, []);

  useEffect(() => {
    if (location.pathname === '/' || location.pathname === '/login' || location.pathname === '/register') {
      localStorage.removeItem('customerEmail');
      localStorage.removeItem('customerId');
      localStorage.removeItem('customerName');
    }
  }, [location.pathname]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <div className="md:w-1/2 bg-gray-800 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg transform transition-transform duration-500 hover:scale-105">
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700">Email</label>
              <input
                type="email"
                className="form-input mt-1 block w-full rounded-full px-4 py-2 bg-gray-100 focus:outline-none focus:bg-gray-200"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700">Password</label>
              <input
                type="password"
                className="form-input mt-1 block w-full rounded-full px-4 py-2 bg-gray-100 focus:outline-none focus:bg-gray-200"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>
            <button type="submit" className="bg-gray-800 text-white py-2 px-4 rounded-full w-full hover:bg-gray-900 transition-colors duration-300">Login</button>
          </form>
          <p className="mt-3 text-sm text-center">Don't have an account? <Link to="/register" className="text-gray-800">Register here</Link>.</p>
          
        </div>
      </div>
      <div className="md:w-1/2 bg-gray-800 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-8xl font-bold mb-4">Login Here</h1>
          <p className="text-lg">Provide Your Registered Email & Password to Proceed</p>
          {/* <img src={bannerImage} alt="Banner" className="mt-4 mx-auto w-3/4" /> */}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
