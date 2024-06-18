import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import './Manager_requests.css';
import Manager_Layout from '../manager_layout/Manager_Layout';
import axios from 'axios';

const Manager_requests = () => {
  const [requests, setRequests] = useState([]);

  const fetchDataFromAPI = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/v1/projectmanager/view');
      const data = response.data;
      if (data && data.length > 0) {
        setRequests(data);
      } else {
        console.error('No data found');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchDataFromAPI();
  }, []);

  const handleAcceptRequest = (request_id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to accept this request?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Accept',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.put(`http://localhost:4000/api/v1/projectmanager/update-accepted/${request_id}`, { accepted: true });
  
          const updatedRequests = requests.map((request) =>
            request.request_id === request_id ? { ...request, accepted: true } : request
          );
          setRequests(updatedRequests);
  
          Swal.fire('Accepted', 'The request has been accepted', 'success');
        } catch (error) {
          console.error('Error accepting request:', error);
          Swal.fire('Error', 'Failed to accept the request. Please try again later.', 'error');
        }
      }
    });
  };

  const handleRejectRequest = async (request_id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to reject this request?',
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Reject',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.post(`http://localhost:4000/api/v1/projectmanager/reject`, { accepted: true, status: 'Rejected', request_id });
          const { message } = response.data;
  
          setRequests((prevRequests) =>
            prevRequests.filter((request) => request.request_id !== request_id)
          );
  
          Swal.fire('Rejected', message, 'success');
        } catch (error) {
          console.error('Error rejecting request:', error);
          Swal.fire('Error', 'An error occurred while rejecting the request', 'error');
        }
      }
    });
  };

  return (
    <Manager_Layout>
      <div className="manager-page">
        <h2>Testing Requests</h2>
        <div className="cards-container">
          {requests.map((request, index) => (
            (request.accepted === false) ? (
              <div className="card" key={index}>
                <h3>{request.customer_name}</h3>
                <p>Status: {request.status}</p>
                {request.assignedTester && <p>Assigned Tester: {request.assignedTester}</p>}
                <div className="buttons">
                  <button className="accept" onClick={() => handleAcceptRequest(request.request_id)}>
                    Accept
                  </button>
                  <button className="reject" onClick={() => handleRejectRequest(request.request_id)}>
                    Reject
                  </button>
                </div>
              </div>
            ) : null
          ))}
        </div>
      </div>
    </Manager_Layout>
  );
};

export default Manager_requests;
