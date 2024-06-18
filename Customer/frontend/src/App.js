// App.js
import React from 'react';
import './tailwind.css';
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom';
import Auth from './pages/auth';
import Register from './components/auth/register';
import Login from './components/auth/login';
import Requests from './pages/requests';
import './App.css';
import CurrentTestRequest from "./components/Dashboard/currenttestrequest";
import TestRequestHistory from "./components/Dashboard/testrequesthistory";
import Home from './pages/Home';
import Dashboard from './pages/dashboard';
import BugInfo from './pages/buginfo';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Auth />} />
        <Route path="/login" element={<Login />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/home" element={<Home />} />
        <Route path="/buginfo" element={<BugInfo />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/current" element={<CurrentTestRequest/>} />
        <Route path="/history" element={<TestRequestHistory/>} />
      </Routes>
    </Router>
  );
};
export default App;
