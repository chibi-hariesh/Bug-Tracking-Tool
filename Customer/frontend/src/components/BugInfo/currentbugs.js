import Swal from 'sweetalert2';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
const CurrentBugs = () => {
    const [currentBugsData, setCurrentBugsData] = useState([]);
    const customerId = localStorage.getItem('customerId');

    useEffect(() => {
        const fetchCurrentBugs = async () => {
            try {
                const response = await axios.post('http://localhost:8080/bug/getcurrentbug', { customerId });
                setCurrentBugsData(response.data.bugs);
            } catch (error) {
                console.error('Error fetching current bugs:', error);
                Swal.fire('Error', 'An error occurred while fetching bug data', 'error');
            }
        };

        if (customerId) {
            fetchCurrentBugs();
        }
    }, [customerId]);

    const handleStatusChange = (id, newStatus) => {
        if (newStatus === 'Need More Info' || newStatus === 'Fixed') {
            Swal.fire({
                title: 'Enter Comment',
                input: 'text',
                inputPlaceholder: 'Enter your comment here...',
                inputAttributes: {
                    autocapitalize: 'off'
                },
                showCancelButton: true,
                confirmButtonText: 'Confirm',
                showLoaderOnConfirm: true,
                preConfirm: (comment) => {
                    if (!comment) {
                        Swal.showValidationMessage('Comment cannot be empty');
                    }
                    return comment;
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    const comment = result.value;
                    setStatusAndNotify(id, newStatus, comment);
                }
            });
        } else {
            setStatusAndNotify(id, newStatus);
        }
    };

    const setStatusAndNotify = (id, newStatus, comment = null) => {
        const requestData = {
            customerId: customerId,
            bugId: id,
            status: newStatus,
            comment: comment
        };

        axios.post('http://localhost:8080/bug/updatebugstatus', requestData)
            .then(response => {
                setCurrentBugsData(prevData => {
                    return prevData.map(bug => {
                        if (bug.bug_id === id) {
                            return { ...bug, status: newStatus };
                        }
                        return bug;
                    });
                });
                Swal.fire('Status Changed', `Bug status changed to ${newStatus}`, 'success');
            })
            .catch(error => {
                console.error('Error updating bug status:', error);
                Swal.fire('Error', 'An error occurred while updating the status', 'error');
            });
    };

    return (
        <div className="container mx-auto py-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Current Bugs</h2>
            <div className="max-w-xl mx-auto">
                {currentBugsData
                    .filter(bug => bug.status !== 'Validated and Closed' && bug.status !== 'Closed')
                    .map(bug => (
                    <div key={bug.bug_id} className="p-4 border-b border-gray-300 mb-4">
                        <p className="text-lg font-semibold text-gray-800 mb-2">Bug ID: <span className="text-blue-500">{bug.bug_id}</span></p>
                        <p className="text-base text-gray-600">Summary: {bug.summary}</p>
                        <p className="text-base text-gray-600">Steps to Reproduce: {bug.steps_to_reproduce}</p>
                        <p className="text-base text-gray-600">Severity: {bug.severity}</p>
                        <p className="text-base text-gray-600">Status: <span className="text-blue-500">{bug.status}</span></p>
                        <p className="text-base text-gray-600">Comment From Tester:<br></br>
                        <span className="text-blue-500"> {bug.bug_tester_comment ? bug.bug_tester_comment : 'No comment from Tester'}</span></p>
                        <div className="flex justify-start mt-4 space-x-4">
                            {bug.status === 'Under Triage' && (
                                <button onClick={() => handleStatusChange(bug.bug_id, 'Accepted')} className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-md">Accept</button>
                            )}
                            {bug.status !== 'Under Triage' && (
                                <button onClick={() => handleStatusChange(bug.bug_id, 'Invalid')} className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md">Invalid</button>
                            )}
                            <button onClick={() => handleStatusChange(bug.bug_id, 'Need More Info')} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md">Need More Info</button>
                            <button onClick={() => handleStatusChange(bug.bug_id, 'Not Reproducible')} className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-md">Not Reproducible</button>
                            {bug.status === 'Accepted' && (
                                <button onClick={() => handleStatusChange(bug.bug_id, 'Fixed')} className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-md">Fixed</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CurrentBugs;
