import React from 'react';
import { Link } from 'react-router-dom';
import { MDBCard, MDBCardImage, MDBCardBody, MDBCardTitle, MDBCardText, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import Manager_Layout from '../manager_layout/Manager_Layout';
import './manager_home.css';

const Manager_home = () => {
  return (
    <Manager_Layout>
      {/* First row with Test Requests and Work in Progress */}
      <MDBRow className='row-cols-1 row-cols-md-2 g-4'>
        <MDBCol>
          <MDBCard className='h-100'>
            <Link to="/manager_requests" className='card-link'>
              <MDBCardImage
                src='https://static.thenounproject.com/png/2623275-200.png'
                alt='Test Requests'
                position='top'
                className='card-image'
              />
              <MDBCardBody>
                <MDBCardTitle>Test Requests</MDBCardTitle>
                <MDBCardText>
                  View and manage test requests
                </MDBCardText>
              </MDBCardBody>
            </Link>
          </MDBCard>
        </MDBCol>
        <MDBCol>
          <MDBCard className='h-100'>
            <Link to="/manager_work" className='card-link'>
              <MDBCardImage
                src='https://png.pngtree.com/png-clipart/20230822/original/pngtree-work-in-progress-warning-sign-with-yellow-and-black-stripes-painted-picture-image_8161322.png'
                alt='Work in Progress'
                position='top'
                className='card-image'
              />
              <MDBCardBody>
                <MDBCardTitle>Work in Progress</MDBCardTitle>
                <MDBCardText>
                  Track ongoing work
                </MDBCardText>
              </MDBCardBody>
            </Link>
          </MDBCard>
        </MDBCol>
      </MDBRow>
      <br/>
      {/* Second row with Available Testers, Customers, and Completed */}
      <MDBRow className='row-cols-1 row-cols-md-3 g-4'>
        <MDBCol>
          <MDBCard className='h-100'>
            <Link to="/manager_testers" className='card-link'>
              <MDBCardImage
                src='https://i.pinimg.com/originals/c5/39/9a/c5399a600cf61e3b2eb5f950c6b488a8.png'
                alt='Available Testers'
                position='top'
                className='card-image'
              />
              <MDBCardBody>
                <MDBCardTitle>Available Testers</MDBCardTitle>
                <MDBCardText>
                  Explore available testers
                </MDBCardText>
              </MDBCardBody>
            </Link>
          </MDBCard>
        </MDBCol>
        <MDBCol>
          <MDBCard className='h-100'>
            <Link to="/manager_customers" className='card-link'>
              <MDBCardImage
                src='https://static.thenounproject.com/png/2344959-200.png'
                alt='Customers'
                position='top'
                className='card-image'
              />
              <MDBCardBody>
                <MDBCardTitle>Customers</MDBCardTitle>
                <MDBCardText>
                  Manage customer information
                </MDBCardText>
              </MDBCardBody>
            </Link>
          </MDBCard>
        </MDBCol>
        <MDBCol>
          <MDBCard className='h-100'>
            <Link to="/manager_completed" className='card-link'>
              <MDBCardImage
                src='https://static.thenounproject.com/png/1584803-200.png'
                alt='Completed'
                position='top'
                className='card-image'
              />
              <MDBCardBody>
                <MDBCardTitle>Completed</MDBCardTitle>
                <MDBCardText>
                  View completed tasks
                </MDBCardText>
              </MDBCardBody>
            </Link>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </Manager_Layout>
  );
};

export default Manager_home;
