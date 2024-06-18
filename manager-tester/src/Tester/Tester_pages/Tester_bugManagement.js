import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import './Tester_bugManagement.css';
import Cookies from "js-cookie";

const PastBugsTable = () => {
  const [pastBugs, setPastBugs] = useState([]);

  useEffect(() => {
    const fetchPastBugs = async () => {
      try {
        const requestId = Cookies.get('request_id');
        if (!requestId) {
          console.error('Request ID not found in the cookie');
          return;
        }
        const response = await fetch(`http://localhost:4000/api/v1/tester/bug-list/${requestId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ requestId: requestId }), 
        });

        if (!response.ok) {
          throw new Error('Failed to fetch bugs');
        }
        console.log(response.json)

        const data = await response.json();
        setPastBugs(data);
      } catch (error) {
        console.error('Error fetching bugs:', error);
      }
    };

    fetchPastBugs();

  }, []);

  const handleBugStatusChange = (bugId, currentStatus) => {
    console.log(bugId);
    switch (currentStatus) {
      case 'Need More Info':
        showAddMoreInfoDialog(bugId);
        break;
      case 'Fixed':
        showValidateCloseDialog(bugId);
        break;
      case 'Not Reproducible':
        showNotReproducibleDialog(bugId);
        break;
      case 'Invalid':
        showInvalidDialog(bugId);
        break;
      default:
        break;
    }
  };
  

  const showAddMoreInfoDialog = (bugId) => {
    Swal.fire({
      title: 'Add More Info',
      input: 'textarea',
      inputLabel: 'Additional Information',
      inputPlaceholder: 'Enter additional information...',
      showCancelButton: true,
      confirmButtonText: 'Submit',
      cancelButtonText: 'Cancel',
      preConfirm: (additionalInfo) => {
        if (!additionalInfo.trim()) {
          Swal.showValidationMessage('Additional information is required');
        }
        return additionalInfo;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        moveBugToStatus(bugId, 'Under Triage', result.value);
      }
    });
  };
  
  

  const showValidateCloseDialog = (bugId) => {
    Swal.fire({
      title: 'Validate and Close',
      text: 'Do you want to validate and close this bug?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Validate and Close',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        moveBugToStatus(bugId, 'Validated and Closed');
      }
    });
  };

  const showNotReproducibleDialog = (bugId) => {
    Swal.fire({
      title: 'Not Reproducible',
      text: 'Please provide comments:',
      input: 'textarea',
      inputLabel: 'Comments',
      inputPlaceholder: 'Enter your comments here...',
      showCancelButton: false,
      confirmButtonText: 'Send to Customer',
      showDenyButton: true,
      denyButtonText: 'Close Bug',
      preConfirm: (comment) => {
        if (!comment.trim()) {
          Swal.showValidationMessage('Comments are required');
        }
        return comment;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        moveBugToStatus(bugId, 'Under Triage', result.value);
      } else if (result.isDenied && !result.isConfirmed) {
        moveBugToStatus(bugId, 'Closed');
      }
    });
  };


  const showInvalidDialog = (bugId) => {
    Swal.fire({
      title: 'Invalid',
      text: 'Please provide comments:',
      input: 'textarea',
      inputLabel: 'Comments',
      inputPlaceholder: 'Enter your comments here...',
      showCancelButton: false,
      confirmButtonText: 'Send to Customer',
      showDenyButton: true,
      denyButtonText: 'Close Bug',
      preConfirm: (comment) => {
        if (!comment.trim()) {
          Swal.showValidationMessage('Comments are required');
        }
        return comment;
      },
    }).then((result) => {
      if (result.isConfirmed) {
        moveBugToStatus(bugId, 'Under Triage', result.value);
      } else if (result.isDenied && !result.isConfirmed) {
        moveBugToStatus(bugId, 'Closed');
      }
    });
  };


  const moveBugToStatus = async (bugId, newStatus, comment = '') => {
    try {
      const result = await Swal.fire({
        title: 'Confirmation',
        text: `Are you sure you want to update bug ${bugId} status to ${newStatus}?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
      });
  
      if (result.isConfirmed) {
        const response = await fetch(`http://localhost:4000/api/v1/tester/bug-status-update/${bugId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ bugId, newStatus, comment }), 
        });
  
        if (!response.ok) {
          throw new Error('Failed to update bug status');
        }
  
        Swal.fire({
          icon: 'success',
          title: 'Bug Updated',
          text: `Bug ${bugId} status updated to ${newStatus}.`,
        });
  
        // Trigger a page refresh
        window.location.reload();
      }
    } catch (error) {
      console.error('Error updating bug status:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update bug status. Please try again later.',
      });
    }
  };
  
  

  const getStatusColor = (status) => {
    switch (status) {
      case 'Closed':
      case 'Validated and Closed':
      case 'Fixed':
        return 'green';
      case 'Invalid':
      case 'Not Reproducible':
      case 'Need More Info':
        return 'red';
      case 'Under Triage':
        return 'orange';
      default:
        return 'black';
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Bugs Management</h2>
      <div class="shadow-lg rounded-lg overflow-hidden mx-4 md:mx-10">
        <table class="w-full table-fixed">
          <thead>
            <tr class="bg-gray-100">
              <th class="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">Bug Name</th>
              <th class="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">Summary</th>
              <th class="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">Created At</th>
              <th class="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">Customer Comment</th>

              <th class="

w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">Status</th>

              <th class="w-1/4 py-4 px-6 text-left text-gray-600 font-bold uppercase">Actions</th>
            </tr>
          </thead>
          <tbody class="bg-white">
            {pastBugs.map((bug) => (
              <tr key={bug.bug_id} class="border-b border-gray-200">
                <td class="py-2 px-6">{bug.bug_name}</td>
                <td class="py-2 px-6">{bug.summary}</td>
                <td class="py-2 px-6">{bug.created_at}</td>
                <td class="py-2 px-6">{bug.bug_customer_comment}</td>

                <td class="py-2 px-6" style={{ color: getStatusColor(bug.status) }}>{bug.status}</td>
                <td class="py-2 px-6">
                  {['Closed', 'Under Triage', 'Validated and Closed','Accepted'].includes(bug.status) ? (
                    <span>No Action Available</span>
                  ) : (
                    <button
                      onClick={() => handleBugStatusChange(bug.bug_id, bug.status)}
                      disabled={bug.status === 'Testing Completed'}
                      class="py-2 px-4 bg-blue-500 text-black font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
                    >
                      {bug.status === 'Need More Info' ? 'Add More Info' : 'Update Status'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PastBugsTable;