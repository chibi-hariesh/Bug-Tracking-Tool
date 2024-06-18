import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Manager_Layout from '../manager_layout/Manager_Layout';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';
import './manager_work.css';

const Manager_work = () => {
  const [testers, setTesters] = useState([]);
  const [workData, setWorkData] = useState([]);

  const fetchWorkData = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/v1/projectmanager/under_review_accepted');
      if (Array.isArray(response.data.data)) {
        setWorkData(response.data.data);
        console.log(response);
      } else {
        console.error('Received non-array data for work');
      }
    } catch (error) {
      console.error('Error fetching work data:', error);
    }
  };

  useEffect(() => {
    fetchWorkData();
    // Poll for updates every 10 seconds
    const interval = setInterval(fetchWorkData, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchAvailableTesters = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/v1/projectmanager/fetchAvailableTesters');
      const data = response.data;
      console.log(response);
      if (data.testers && data.testers.length > 0) {
        setTesters(data.testers);
      } else {
        console.error('No available testers found');
      }
    } catch (error) {
      console.error('Error fetching available testers:', error);
    }
  };

  useEffect(() => {
    fetchAvailableTesters();
    const interval = setInterval(fetchWorkData, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleBlockTesting = async (id) => {
    try {
      const { value: reason } = await Swal.fire({
        title: 'Block Testing',
        input: 'text',
        inputLabel: 'Reason',
        inputPlaceholder: 'Enter reason...',
        inputAttributes: {
          required: 'true'
        },
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Block',
        customClass: {
          title: 'swal2-title-custom',
          content: 'swal2-content-custom',
          confirmButton: 'swal2-confirm-button-custom',
          cancelButton: 'swal2-cancel-button-custom'
        }
      });

      if (reason) {
        const response = await axios.post('http://localhost:4000/api/v1/projectmanager/blockTesting', {
          id,
          reason
        });

        console.log(response.data);

        const updatedWorkData = workData.map((work) =>
          work.id === id ? { ...work, status: 'Testing Blocked', reason } : work
        );

        setWorkData(updatedWorkData);

        Swal.fire('Success', 'Testing blocked successfully', 'success');
        fetchWorkData();
      }
    } catch (error) {
      console.error('Error blocking testing:', error);
      Swal.fire('Error', 'Failed to block testing', 'error');
    }
  };
  const handleResumeTesting = async (id) => {
    try {
      const result = await Swal.fire({
        title: 'Testing Resumed',
        text: 'Do you want to resume testing?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Resume',
      });

      if (result.isConfirmed) {
        const response = await axios.post('http://localhost:4000/api/v1/projectmanager/resumeTesting', {
          id
        });

        console.log(response.data);

        const updatedWorkData = workData.map((work) =>
          work.id === id ? { ...work, status: 'Testing In Progress', reason: '' } : work
        );

        setWorkData(updatedWorkData);
        fetchWorkData();
      }
    } catch (error) {
      console.error('Error resuming testing:', error);
      Swal.fire('Error', 'Failed to resume testing', 'error');
    }
  };

  const handleCompleteTesting = async (id) => {
    Swal.fire({
      title: 'Testing Completed',
      text: 'Do you want to mark testing as completed?',
      icon: 'success',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Mark as Completed',
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Make HTTP POST request to update backend
          await axios.post('http://localhost:4000/api/v1/projectmanager/processTestingRequest', {
            requestId: id,
            status: 'Testing Completed' // Update status to 'Completed'
          });
          // Remove the completed work item from the UI
          const updatedWorkData = workData.filter((work) => work.id !== id);
          setWorkData(updatedWorkData);
          fetchAvailableTesters();
          fetchWorkData();
          Swal.fire('Success', 'Testing marked as completed successfully', 'success');
        } catch (error) {
          console.error('Error marking testing as completed:', error);
          Swal.fire('Error', 'Failed to mark testing as completed', 'error');
        }
      }
    });
  };

  const handleAssignTester = (request_id) => {
    const inputOptions = testers?.length > 0 ? testers.reduce((options, tester) => {
      options[tester.name] = tester.name;
      return options;
    }, {}) : {};

    Swal.fire({
      title: 'Assign Tester',
      text: 'Select an available tester:',
      input: 'select',
      inputOptions: inputOptions,
      inputPlaceholder: 'Select a tester',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Assign',
      customClass: {
        title: 'swal2-title-custom',
        content: 'swal2-content-custom',
        confirmButton: 'swal2-confirm-button-custom',
        cancelButton: 'swal2-cancel-button-custom'
      }
    }).then(async (result) => { // Make the function async to use await
      if (result.isConfirmed) {
        const testerName = result.value;
        const selectedTester = testers.find(tester => tester.name === testerName);
        if (selectedTester) {
          try {
            // Make HTTP POST request to update backend
            const response = await axios.post('http://localhost:4000/api/v1/projectmanager/updateStatusAndAssignTester', {
              request_id: request_id,
              status: 'Request Accepted', // Update the status here
              tester_id: selectedTester.tester_id // Pass the tester_id instead of tester_name
            });
            console.log(response.data); // Log the response from the backend
            // Update the work data only if the backend update is successful
            const updatedWorkData = workData.map((work) =>
              work.request_id === request_id ? { ...work, status: 'Testing In Progress', tester_name: selectedTester.name } : work
            );
            setWorkData(updatedWorkData);
            Swal.fire('Success', 'Tester assigned and status updated successfully', 'success');

            // Refetch work data after assigning tester and updating status
            fetchAvailableTesters();
            fetchWorkData();
          } catch (error) {
            console.error('Error updating status and assigning tester:', error);
            Swal.fire('Error', 'Failed to assign tester and update status', 'error');
          }
        } else {
          console.error('Selected tester not found');
          Swal.fire('Error', 'Selected tester not found', 'error');
        }
      }
    });
  };




  return (
    <Manager_Layout>
      <div className='box'>
        <h2>Work In Process</h2>
        {workData.map((work) => (
          <span className='display' key={work.request_id}>
            <div className='maininside'>
              <div className='inside'>
                <h6>Tester</h6>
                <h4>{work.tester_name || "Not Assigned"}</h4> {/* Display "Not Assigned" if no tester is assigned */}
              </div>
              <div className='inside'>
                <h6>Client</h6>
                <h4>{work.customer_name}</h4>
              </div>
              <div className='inside'>
                <h6>Work status</h6>
                <h4 style={{ width: '120%' }}>{work.status}</h4>
                {(work.status !== 'Testing Blocked' && work.reason) && <p>Reason: {work.reason}</p>}
                {work.testLog && <p>Test Log: {work.testLog}</p>}
                {work.instructions && <p>Instructions: {work.instructions}</p>}
              </div>
              <div className='inside'>
                {work.status === 'Request Accepted' && (
                  <h3>Tester yet to start</h3>
                )}
                {(work.status === 'Under Review') && (
                  <button className='assign' onClick={() => handleAssignTester(work.request_id)}>Assign Tester</button>
                )}
                {(work.status === 'Testing In Progress') && (
                  <button className='block' onClick={() => handleBlockTesting(work.request_id)}>Block Testing</button>
                )}
                {(work.status === 'Testing In Progress' || work.status === 'Testing Blocked') && (
                  <button className='complete' onClick={() => handleCompleteTesting(work.request_id)}>Testing Completed</button>
                )}
                {(work.status === 'Testing Blocked') && (
                  <button className='resume' onClick={() => handleResumeTesting(work.request_id)}>Resume Testing</button>
                )}
              </div>
            </div>
          </span>
        ))}
      </div>
    </Manager_Layout>
  );
};

export default Manager_work;
