import React, { useState, useEffect } from "react";
import axios from 'axios';

const CurrentTestRequest = () => {
    // eslint-disable-next-line
    const [alltestRequests, setTestRequests] = useState([]);
    const [currentTestRequests, setCurrentTestRequests] = useState([]);

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const response = await axios.post('http://localhost:8080/testrequest/getcurrentrequest', {
                    customer_id: localStorage.getItem('customerId')
                });
                setTestRequests(response.data.requests);
                const filteredRequests = response.data.requests.filter(request => request.status.toLowerCase() !== 'testing completed');
                setCurrentTestRequests(filteredRequests);
            } catch (error) {
                console.error('Error fetching test requests:', error);
            }
        };

        fetchRequests();
    }, []);

    return (
        <section className="container mx-auto py-8">
            <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl sm:text-4xl font-semibold text-center text-gray-800 py-4 sm:py-6">Current Test Requests</h2>
                <div className="divide-y divide-gray-200">
                    {currentTestRequests.map(request => (
                        <div key={request.request_id} className="py-4 sm:py-6 px-4 sm:px-8">
                            <p className="text-lg sm:text-xl font-semibold text-gray-800">Request ID: <span className="text-blue-500">{request.request_id}</span></p>
                            <p className="text-base sm:text-lg text-gray-600 mt-2">Request Name: <span className="text-blue-500">{request.request_name}</span></p>
                            <p className="text-base sm:text-lg text-gray-600 mt-2">Status: <span className="text-blue-500">{request.status}</span></p>
                            {/* Print assigned tester's name and email if status is "testing in progress" */}
                            {request.status.toLowerCase() === "testing in progress" ? (
                                <>
                                    <p className="text-base sm:text-lg text-gray-600 mt-2">Assigned Tester Name: <span className="text-blue-500">{request.assigned_tester_name}</span></p>
                                    <p className="text-base sm:text-lg text-gray-600 mt-2">Assigned Tester Email: <span className="text-blue-500">{request.assigned_tester_email}</span></p>
                                </>
                            ) : (
                                <p className="text-base sm:text-lg text-gray-600 mt-2">Tester not yet assigned</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default CurrentTestRequest;
