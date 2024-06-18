import React, { useState, useEffect } from 'react';
import { Container, Card, CardContent, Button } from '@material-ui/core';
import Swal from 'sweetalert2';
import Navbar from './Tester_navbar';
import './Tester_home.css';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';

const Tester_home = () => {
  const [testData, setTestData] = useState(null);

  useEffect(() => {
    fetchTestData();
  }, []);

  const fetchTestData = async () => {
    try {
      const testerId = Cookies.get('tester_id');
      const response = await fetch(`http://localhost:4000/api/v1/tester/${testerId}/testrequests`);
      const data = await response.json();
      setTestData(data);
    } catch (error) {
      console.error('Error fetching test data:', error);
    }
  };

  const handleStartTesting = async (requestId) => {
    try {
      // Store tester_id and request_id in cookies
      Cookies.set('tester_id', Cookies.get('tester_id'));
      Cookies.set('request_id', requestId);
  
      // Update the status of the test request to "Testing In Progress"
      const response = await fetch(`http://localhost:4000/api/v1/tester/${requestId}/start-testing`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Testing In Progress' }),
      });
      if (!response.ok) {
        throw new Error('Failed to start testing');
      }
      
      // Redirect to the testing details page
      window.location.href = '/Tester_details';
    } catch (error) {
      console.error('Error starting testing:', error);
    }
  };
  

  const renderTestRequest = () => {
    if (testData && testData.length > 0) {
      return (
        <div className="test-request-container">
          {testData.map((testRequest, index) => (
            <Card key={index} className="test-request">
              <CardContent>
                <h3>Test Request {index + 1}</h3>
                <table>
                  <tbody>
                    <tr>
                      <td><strong>Test Name:</strong></td>
                      <td>{testRequest.request_name}</td>
                    </tr>
                    <tr>
                      <td><strong>Customer ID:</strong></td>
                      <td>{testRequest.customer_id}</td>
                    </tr>
                    <tr>
                      <td><strong>Project Status:</strong></td>
                      <td>{testRequest.status}</td>
                    </tr>
                  </tbody>
                </table>
                {testRequest.status === "Testing Completed" ? (
                  <p style={{ fontSize: '24px', fontWeight: 'bold', color: 'green' }}>Testing Completed</p>
                ) : (
                  <Link to="/Tester_details">
                    <Button variant="contained" color="primary" onClick={() => handleStartTesting(testRequest.request_id)}>
                      {testRequest.status === "Testing In Progress" ? "Continue Testing" : "Start Testing"}
                    </Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      );
    } else {
      return (
        <div className="no-test">
          <p>No test assigned. Please come back later.</p>
        </div>
      );
    }
  };
  

  return (
    <div>
      <Navbar color="black" />
      <div className="content-container">
        <Container className="dashboard-container">
          {renderTestRequest()}
        </Container>
      </div>
    </div>
  );
}

export default Tester_home;
