import React, { useState, useEffect } from 'react';
import Manager_Layout from '../manager_layout/Manager_Layout';
import './Manager_customers.css';
import axios from 'axios';

const Manager_customers = () => {
  const [customers, setCustomers] = useState([]);
  const [filterStatus, setFilterStatus] = useState('');

  // Fetch customer data from the API
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:4000/api/v1/projectmanager/fetchCustomerDetails');
      const data = response.data;
      if (data.customers && data.customers.length > 0) {
        setCustomers(data.customers);
      } else {
        console.error('No customers found');
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Yet to Assign':
        return 'black';
      case 'Request Accepted':
        return 'darkgreen';
      // Add more cases if needed
      default:
        return 'black';
    }
  };

  const handleFilterChange = (event) => {
    setFilterStatus(event.target.value);
  };

  const filteredCustomers = filterStatus ? customers.filter(customer => customer.status === filterStatus) : customers;

  return (
    <Manager_Layout>
      <div>
        <h2>Customers</h2>
        <div className="filter-container">
          <label htmlFor="filter" className='header'>Filter by Status:</label>
          <select id="filter" value={filterStatus} onChange={handleFilterChange} style={{ width: '200px', marginLeft: '10px' }}>
            <option value="">All</option>
            <option value="Yet to Assign">Yet to Assign</option>
            <option value="Request Accepted">Request Accepted</option>
            {/* Add more options for other statuses if needed */}
          </select>
        </div>
        <div className="cards-container">
          {filteredCustomers.map((customer) => (
            <div className="card" key={customer.customer_id}>
              <div className="card-content">
                <h3>{customer.customer_name}</h3>
                <table>
                  <tbody>
                    <tr>
                      <td><b>Email:</b></td>
                      <td>{customer.email}</td>
                    </tr>
                    <tr>
                      <td><b>Tester Name:</b></td>
                      <td>{customer.tester_name}</td>
                    </tr>
                    <tr>
                      <td><b>Status:</b></td>
                      <td style={{ color: getStatusColor(customer.status) }}>{customer.status}</td>
                    </tr>
                    {/* Add more rows if needed */}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Manager_Layout>
  );
};

export default Manager_customers;
