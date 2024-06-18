import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BugHistory = () => {
    const [bugHistoryData, setBugHistoryData] = useState([]);
    const customerId = localStorage.getItem('customerId');

    useEffect(() => {
        const fetchBugHistory = async () => {
            try {
                const response = await axios.post('http://localhost:8080/bug/getbughistory', { customerId });
                setBugHistoryData(response.data.bugHistory);
            } catch (error) {
                console.error('Error fetching bug history:', error);
            }
        };
        
        if (customerId) {
            fetchBugHistory();
        }
    }, [customerId]);

    return (
        <div className="container mx-auto py-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Bug History</h2>
            <div className="max-w-xl mx-auto bg-white rounded-lg shadow-lg">
                <div className="divide-y divide-gray-200">
                    {bugHistoryData.map(bug => (
                        <div key={bug.bug_id} className="p-4">
                            <p className="text-gray-500 mt-2"><strong>Request ID:</strong> {bug.request_id}</p>
                            <h3 className="font-semibold text-lg">Bug ID: {bug.bug_id}</h3>
                            <p className="text-gray-600 mt-2"><strong>Summary:</strong> {bug.summary}</p>
                            <p className="text-gray-500 mt-2"><strong>Status:</strong> <span className="text-blue-500">{bug.status}</span></p>
                            <p className="text-gray-500 mt-2"><strong>Completed At:</strong> {new Date(bug.completed_at).toLocaleString()}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default BugHistory;
