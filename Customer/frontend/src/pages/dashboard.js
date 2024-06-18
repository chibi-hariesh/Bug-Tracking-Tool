import React from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import CurrentTestRequest from "../components/Dashboard/currenttestrequest";
import TestRequestHistory from "../components/Dashboard/testrequesthistory";

const Dashboard = () => {
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1);
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <center><h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1></center>
                <button onClick={goBack} className="mb-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center">
                    <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                    Back
                </button>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                        <div className="p-4 sm:p-6">
                            <CurrentTestRequest />
                        </div>
                    </div>
                    <div className="bg-white overflow-hidden shadow-sm rounded-lg">
                        <div className="p-4 sm:p-6">
                            <TestRequestHistory />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
