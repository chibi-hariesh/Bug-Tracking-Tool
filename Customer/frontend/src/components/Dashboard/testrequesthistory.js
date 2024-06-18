import React, { useEffect, useState } from "react";
import axios from "axios";

const TestRequestHistory = () => {
    const [historyData, setHistoryData] = useState([]);
    const [customer_id, setCustomerId] = useState('');

    useEffect(() => {
        const customerIdFromStorage = localStorage.getItem('customerId');
        if (customerIdFromStorage) {
            setCustomerId(customerIdFromStorage);
        }
    }, []);

    useEffect(() => {
        const fetchHistoryData = async () => {
            try {
                const response = await axios.post('http://localhost:8080/testrequest/getrequesthistory', { customer_id });
                setHistoryData(response.data.historyData);
            } catch (error) {
                console.error('Error fetching test request history:', error);
            }
        };

        if (customer_id) {
            fetchHistoryData();
        }
    }, [customer_id]);

    return (
        <section className="container mx-auto py-8">
            <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl sm:text-4xl font-semibold text-center text-gray-800 py-4 sm:py-6">Test Request History</h2>
                <div className="divide-y divide-gray-200">
                    {historyData.map((data, index) => (
                        <div key={index} className="py-4 sm:py-6 px-4 sm:px-8">
                            <p className="text-lg sm:text-xl font-semibold text-gray-800">Request ID: <span className="text-blue-500">{data.requestId}</span></p>
                            <p className="text-base sm:text-lg text-gray-600 mt-2">Request Name: <span className="text-blue-500">{data.requestName}</span></p>
                            <p className="text-base sm:text-lg text-gray-600 mt-2">Status: <span className="text-blue-500">{data.status}</span></p>
                            {data.assignedTesterName && (
                                <p className="text-base sm:text-lg text-gray-600 mt-2">Assigned Tester Name: <span className="text-blue-500">{data.assignedTesterName}</span></p>
                            )}
                            {!data.assignedTesterName && (
                                <p className="text-base sm:text-lg text-gray-600 mt-2">Tester not assigned</p>
                            )}
                            {data.assignedTesterEmail && (
                                <p className="text-base sm:text-lg text-gray-600 mt-2">Assigned Tester Email: <span className="text-blue-500">{data.assignedTesterEmail}</span></p>
                            )}
                            {!data.assignedTesterEmail && (
                                <p className="text-base sm:text-lg text-gray-600 mt-2">Tester not assigned</p>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default TestRequestHistory;
