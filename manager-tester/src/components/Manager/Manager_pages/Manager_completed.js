import React, { useState, useEffect } from 'react';
import Manager_Layout from '../manager_layout/Manager_Layout';
import axios from 'axios';
import Swal from 'sweetalert2';
import './Manager_customers.css';

const Manager_customers = () => {
  const [testingRequestHistory, setTestingRequestHistory] = useState([]);

  const fetchTestingRequestHistory = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/v1/projectmanager/fetchTestingRequestHistory');
      const data = response.data;
      setTestingRequestHistory(data.testing_request_history);
    } catch (error) {
      console.error('Error fetching testing request history:', error);
    }
  };
  useEffect(() => {
    fetchTestingRequestHistory();
    const interval = setInterval(fetchTestingRequestHistory, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleBugReportClick = async (request_id) => {
    try {
        const response = await axios.get(`http://localhost:4000/api/v1/projectmanager/bug-history/${request_id}`);
        const data = response.data;
        
        // Check if there are bug reports
        if (data.bug_history && data.bug_history.length > 0) {
            // Display bug report details using SweetAlert
            Swal.fire({
                title: 'Bug Report Details',
                html: `
                    <ul style="list-style: none; padding: 0;">
                        ${data.bug_history.map(bug => `
                            <li style="border: 1px solid #ccc; padding: 10px; margin-bottom: 10px;">
                                <strong>Bug Name:</strong> ${bug.bug_name}<br>
                                <strong>Summary:</strong> ${bug.summary}<br>
                                <strong>Status:</strong> ${bug.status}<br>
                                <strong>Completed At:</strong> ${bug.completed_at}<br>
                            </li>
                        `).join('')}
                    </ul>
                `,
                showCloseButton: true,
                showCancelButton: false,
                focusConfirm: false,
            });
        } else {
            // Display message if no bugs fixed
            Swal.fire({
                title: 'No Bugs Fixed',
                text: 'No bugs have been fixed for this request.',
                icon: 'info',
                confirmButtonText: 'OK'
            });
        }
    } catch (error) {
        console.error('Error fetching bug history:', error);
    }
};


  return (
    <Manager_Layout>
      <div>
        <h2>Customer Details</h2>
        <div className="cards-container">
          {testingRequestHistory.map(request => (
            <div className="card" key={request.request_id}>
              <div className="card-content">
                <h3>{request.request_name}</h3>
                <table>
                  <tbody>
                    <tr>
                      <td><strong>Request Name:</strong></td>
                      <td>{request.request_name}</td>
                    </tr>
                    <tr>
                      <td><strong>Customer Name:</strong></td>
                      <td>{request.customer_name}</td>
                    </tr>
                    <tr>
                      <td><strong>Tester Name:</strong></td>
                      <td>{request.tester_name}</td>
                    </tr>
                    <tr>
                      <td><strong>Status:</strong></td>
                      <td>{request.status}</td>
                    </tr>
                    <tr>
                      <td colSpan="2">
                        <button onClick={() => handleBugReportClick(request.request_id)}>View Bug Report</button>
                      </td>
                    </tr>
                  </tbody>
                </table>
                
              </div>
            </div>
          ))}
        </div>
      </div>
    </Manager_Layout>
  );
};

export default Manager_customers;
