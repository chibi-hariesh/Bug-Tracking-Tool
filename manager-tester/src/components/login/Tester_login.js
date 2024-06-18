import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie'; // Import js-cookie

function TesterLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:4000/api/v1/tester/testerlogin', { email, password });
      const { data } = response;

      // Check if login was successful
      if (data.message === 'Login successful') {
        // Save tester ID in a cookie
        Cookies.set('tester_id', data.tester.tester_id);

        // Navigate to Tester_home page
        window.location.href = '/Tester_home';
      } else {
        setError('Invalid email or password');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      setError('Failed to login. Please try again later.');
    }
  };

  return (
    <div className="container">
      <h1 className="label">Tester Login</h1>
      <form className="login_form" onSubmit={handleSubmit}>
        <div className="font">Email or Phone</div>
        <input
          autoComplete="off"
          type="text"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div id="email_error">{error}</div>
        <div className="font font2">Password</div>
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div id="pass_error">{error}</div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default TesterLogin;
