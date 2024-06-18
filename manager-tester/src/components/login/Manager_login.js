import React, { useState } from 'react';
import './Manager_login.css';
import { useNavigate } from 'react-router-dom';
import axios from "axios";


const Manager_login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email) {
      setEmailError('Please enter your email');
      return;
    }
    if (!password) {
      setPasswordError('Please enter your password');
      return;
    }

    try {
      const res = await axios.post('http://localhost:4000/api/v1/projectmanager/managerlogin', { email, password });

      if (res.status !== 200) {
        // Handle non-200 status codes (e.g., 401 for unauthorized)
        if (res.status === 401) {
          setEmailError('Invalid email or password');
        }
        return;
      }

      const data = res.data;
      if (data.success) {
        // Navigate to Manager_home route after successful login
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        navigate('/Manager_home');
      } 
    } catch (error) {
      console.error('Error logging in:', error);
      // Handle other errors (e.g., network issues)
    }
  };
  return (
    <div className="container">
      <h1 className="label">Manager Login</h1>
      <form className="login_form" onSubmit={handleLogin}>
        <div className="font">Email</div>
        <input
          autoComplete="off"
          type="text"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {emailError && <div id="email_error">{emailError}</div>}
        <div className="font font2">Password</div>
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {passwordError && <div id="pass_error">{passwordError}</div>}
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Manager_login;
