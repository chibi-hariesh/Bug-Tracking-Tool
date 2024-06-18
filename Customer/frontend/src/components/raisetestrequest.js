import React, { useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css';

const RaiseTestRequest = () => {
    const [web_application_url, setweb_application_url] = useState('');
    const [username, setusername] = useState('');
    const [password, setpassword] = useState('');
    const [request_name, setrequest_name] = useState('');
    const navigate = useNavigate(); // Use useNavigate hook

    const handleRaiseRequest = async (e) => {
        e.preventDefault();
    
        // Validate input fields
        if (!request_name || !web_application_url) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please fill in all the Mandatory fields!',
            });
            return;
        }
    
        Swal.fire({
            title: 'Confirm',
            text: 'Are you sure you want to raise the test request?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Raise Test Request',
            cancelButtonText: 'Cancel'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const testRequestData = {
                    customer_id: localStorage.getItem('customerId'),
                    request_name,
                    web_application_url,
                    username,
                    password,
                };
    
                try {
                    const response = await axios.post('http://localhost:8080/testrequest/raiserequests', testRequestData);
                    console.log('Response:', response);
    
                    console.log('Test request raised successfully:', response.data);
                    // Display toast message for success
                    toast.success('Test request raised successfully!', {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: true,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                    setTimeout(() => {
                        navigate('/home');
                    }, 2000);
                } catch (error) {
                    if (error.response && error.response.status === 400) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: error.response.data.error,
                        });
                        setTimeout(() => {
                            navigate('/home');
                        }, 2000);
                    } else {
                        toast.error('Test request Failed!', {
                            position: "top-right",
                            autoClose: 2000,
                            hideProgressBar: true,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                        });
                        console.error('Error while raising test request:', error);
                        setTimeout(() => {
                            navigate('/home');
                        }, 2000);
                    }
                }
            }
        });
    }
    

    return (
        <div className="max-w-md mx-auto mt-8 bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Raise Test Request</h2>
                <form onSubmit={handleRaiseRequest}>
                    <div className="mb-4">
                        <label htmlFor="testRequestName" className="block text-gray-700">Test Request Name:</label>
                        <input
                            type="text"
                            id="testRequestName"
                            className="form-input mt-1 block w-full rounded-full px-4 py-2 bg-gray-100 focus:outline-none focus:bg-gray-200"
                            value={request_name}
                            onChange={(e) => setrequest_name(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="applicationUrl" className="block text-gray-700">Application URL:</label>
                        <input
                            type="text"
                            id="applicationUrl"
                            className="form-input mt-1 block w-full rounded-full px-4 py-2 bg-gray-100 focus:outline-none focus:bg-gray-200"
                            value={web_application_url}
                            onChange={(e) => setweb_application_url(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="credentialUsername" className="block text-gray-700">Credential Username:</label>
                        <input
                            type="text"
                            id="credentialUsername"
                            className="form-input mt-1 block w-full rounded-full px-4 py-2 bg-gray-100 focus:outline-none focus:bg-gray-200"
                            value={username}
                            onChange={(e) => setusername(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="credentialPassword" className="block text-gray-700">Credential Password:</label>
                        <input
                            type="password"
                            id="credentialPassword"
                            className="form-input mt-1 block w-full rounded-full px-4 py-2 bg-gray-100 focus:outline-none focus:bg-gray-200"
                            value={password}
                            onChange={(e) => setpassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-md w-full">Raise Test Request</button>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
};

export default RaiseTestRequest;
