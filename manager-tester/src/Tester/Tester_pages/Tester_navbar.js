import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@material-ui/core';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie'; // Import js-cookie
import { lightBlue } from '@material-ui/core/colors';

const Navbar = ({ color }) => {
  const handleLogout = () => {
    // Delete cookies
    Cookies.remove('request_id'); // Replace 'token' with the name of your cookie
    Cookies.remove('tester_id');
    // Redirect to Tester Login
    window.location.href = '/Tester_login';
  };

  return (
    <AppBar position="fixed" style={{ backgroundColor: color }}>
      <Toolbar>
        <Typography variant="h6" color="inherit" component={Link} to="/Tester_home" style={{ flexGrow: 1 }}>
          Tester Dashboard
        </Typography>
        <Box border={2} borderRadius={5} borderColor="lightBlue">
          <Button color="inherit" onClick={handleLogout}>Logout</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
