import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const Register = () => {
  const [customer_name, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // eslint-disable-next-line
  const [showForm, setShowForm] = useState(false); // State to control form visibility
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/auth/register', {
        email,
        password,
        customer_name
      });

      if (response.status === 201) {
        await Swal.fire({
          icon: 'success',
          title: 'Registered Successfully!',
          showCancelButton: true,
          confirmButtonText: 'Continue',
          cancelButtonText: 'Cancel',
        }).then((result) => {
          if (result.isConfirmed) {
            navigate('/login');
          }
        });
      }
    } catch (error) {
      console.error('Error:', error);
      await Swal.fire({
        icon: 'error',
        title: 'Registration Failed',
        text: 'Please try again later.',
      });
    }
  };

  useEffect(() => {
    // Show the form with animation when component mounts
    setShowForm(true);
  }, []);

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <div className="lg:flex-1 flex items-center justify-center bg-gray-800">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg transform transition-transform duration-500 hover:scale-105">
          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700">Name</label>
              <input
                type="text"
                className="form-input mt-1 block w-full rounded-full px-4 py-2 bg-gray-100 focus:outline-none focus:bg-gray-200 transition duration-300 text-gray-900"
                id="name"
                value={customer_name}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700">Email</label>
              <input
                type="email"
                className="form-input mt-1 block w-full rounded-full px-4 py-2 bg-gray-100 focus:outline-none focus:bg-gray-200 transition duration-300 text-gray-900"
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
                className="form-input mt-1 block w-full rounded-full px-4 py-2 bg-gray-100 focus:outline-none focus:bg-gray-200 transition duration-300 text-gray-900"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>
            <button type="submit" className="bg-gray-800 text-white py-2 px-4 rounded-full w-full hover:bg-gray-900 transition-colors duration-300">Register</button>
          </form>
          <p className="mt-3 text-sm text-center">Already have an account? <Link to="/login" className="text-gray-800">Login here</Link>.</p>
        </div>
      </div>
      <div className="lg:flex-1 bg-gray-800 flex items-center justify-center">
        <div className="text-white text-center">
        <h1 className="text-8xl font-bold mb-4">Register Here</h1>
          <p className="text-lg mb-4">Provide The Details and Register Yourself</p>
          {/* <img src={bannerImage} alt="Banner" className="mt-4 mx-auto w-3/4" /> */}
        </div>
      </div>
    </div>
  );
};

export default Register;
