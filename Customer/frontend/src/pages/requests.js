import React from 'react';
import RaiseTestRequest from '../components/raisetestrequest';
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";

const Requests = () => {
    const navigate = useNavigate(); // Use useNavigate hook
    
    const goBack = () => {
        navigate(-1);
    };
    
    return (
        <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
            <button onClick={goBack} className="absolute top-4 left-4 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center z-10">
                <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                Back
            </button>
            <RaiseTestRequest />
        </div>
    );
};

export default Requests;
