import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MDBCard, MDBCardBody, MDBCardTitle, MDBCardText, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import ManagerLayout from '../manager_layout/Manager_Layout';
import './Manager_testers.css';

const Manager_testers = () => {
    const [testersData, setTesters] = useState([]);

    const fetchAvailableTesters = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/v1/projectmanager/ManageTester'); // Replace '/your/api/endpoint' with your actual API endpoint
        const data = response.data;
        console.log(response)
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
        const interval = setInterval(fetchAvailableTesters, 10000);
        return () => clearInterval(interval);
    }, []);

    return (
        <ManagerLayout>
            <h2>Manage Testers</h2>
            <MDBRow className='row-cols-1 row-cols-md-3 g-4'>
                {testersData.map((tester) => (
                    <MDBCol key={tester.tester_id}>
                        <MDBCard className='h-100 tester-card'>
                            <MDBCardBody>
                                <MDBCardTitle>{tester.name}</MDBCardTitle>
                                <MDBCardText>Email: {tester.email}</MDBCardText>
                                <MDBCardText>Status: {tester.availability === 'Available' ? <span className='status-green'>Available</span> : <span className='status-red'>Not Available</span>}</MDBCardText>
                                {tester.customer_id && <MDBCardText>Assigned Customer: {tester.customer_name}</MDBCardText>}
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                ))}
            </MDBRow>
        </ManagerLayout>
    );
};

export default Manager_testers;
