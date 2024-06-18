import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Card, CardContent, Typography, Button, Table, TableBody, TableCell, TableContainer, TableRow } from '@material-ui/core';
import Navbar from './Tester_navbar';
import './Tester_details.css';
import Cookies from 'js-cookie';

const Tester_details = () => {
  const [testRequestData, setTestRequestData] = useState(null);

  useEffect(() => {
    // Fetch test request details using request_id from cookie
    const requestId = Cookies.get('request_id');
    fetchTestRequestData(requestId);
  }, []);

  const fetchTestRequestData = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:4000/api/v1/tester/test-details/${requestId}`);
      const data = await response.json();
      setTestRequestData(data);
    } catch (error) {
      console.error('Error fetching test request data:', error);
    }
  };

  return (
    <div>
      <Navbar color="black" />
      <Container className="page-container">
        {testRequestData && (
          <Card className="test-request-card">
            <CardContent>
              <Typography variant="h5" gutterBottom>Test Request Details</Typography>
              <TableContainer>
                <Table>
                  <TableBody>
                    <TableRow>
                      <TableCell><strong>Test Name:</strong></TableCell>
                      <TableCell>{testRequestData.request_name}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Customer Name:</strong></TableCell>
                      <TableCell>{testRequestData.customer_name}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Project Status:</strong></TableCell>
                      <TableCell>{testRequestData.status}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>URL:</strong></TableCell>
                      <TableCell>{testRequestData.web_application_url}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Email:</strong></TableCell>
                      <TableCell>{testRequestData.email}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell><strong>Password:</strong></TableCell>
                      <TableCell>{testRequestData.password}</TableCell>
                    </TableRow>
                    {/* Add other fields as needed */}
                  </TableBody>
                </Table>
              </TableContainer>
              <div className="button-container">
                {testRequestData.status !== "Testing Completed" && testRequestData.status !== "Testing Blocked" && (
                  <Link to='/Tester_bugCreate'>
                    <Button
                      id="create-bug-btn"
                      variant="contained"
                      color="primary"
                    >
                      Create Bug
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>
        )}
        <div className="bug-button">
          <Link to='/Tester_bugManagement'><Button variant="contained" color="primary">Bugs Management</Button></Link>
        </div>
      </Container>
    </div>
  );
}

export default Tester_details;
