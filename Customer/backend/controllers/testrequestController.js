// controllers/customerController.js
const db = require('../models/db');

exports.createRequest = async (req, res) => {
  const { customer_id, request_name, web_application_url, username, password } = req.body;
  const existingRequestsQuery = 'SELECT status FROM testingrequest WHERE customer_id = $1';
  const existingRequestsValues = [customer_id];

  try {
    const existingRequests = await db.query(existingRequestsQuery, existingRequestsValues);
    
    if (existingRequests.rows.length > 0) {
      const hasPendingRequests = existingRequests.rows.some(request => request.status !== 'Testing Completed');
      const status = hasPendingRequests ? 'Pending' : 'Under Review';
      const accepted = false;
      
      if (hasPendingRequests) {
        return res.status(400).json({ error: `You already have a Test Request ${existingRequests.rows[0].status}`});
      }
      
      const insertQuery = 'INSERT INTO testingrequest (customer_id, request_name, web_application_url, email, password, status, accepted) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
      const insertValues = [customer_id, request_name, web_application_url, username, password, status, accepted];
      const { rows } = await db.query(insertQuery, insertValues);
      
      return res.status(201).json({ request: rows[0] });
    } else {
      const status = 'Under Review';
      const accepted = false;
      
      const insertQuery = 'INSERT INTO testingrequest (customer_id, request_name, web_application_url, email, password, status, accepted) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';
      const insertValues = [customer_id, request_name, web_application_url, username, password, status, accepted];
      const { rows } = await db.query(insertQuery, insertValues);
      
      return res.status(201).json({ request: rows[0] });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};


exports.getCurrentRequestStatus = async (req, res) => {
  const { customer_id } = req.body;

  const query = `
    SELECT tr.request_id, tr.request_name, tr.status, 
           t.name AS assigned_tester_name, t.email AS assigned_tester_email
    FROM testingrequest tr
    LEFT JOIN request_acceptance ra ON tr.request_id = ra.request_id
    LEFT JOIN tester t ON ra.tester_id = t.tester_id
    WHERE tr.customer_id = $1`;

  const values = [customer_id];

  try {
    const { rows } = await db.query(query, values);
    console.log(rows)
    if (rows.length === 0) {
      res.status(404).json({ error: 'No test requests found for the customer' });
    } else {
      const requests = rows.map(row => {
        const request = {
          request_id: row.request_id,
          request_name: row.request_name,
          status: row.status,
        };
        // If the status is "testing in progress", include the assigned tester information
        if (row.status.toLowerCase() === 'testing in progress') {
          request.assigned_tester_name = row.assigned_tester_name;
          request.assigned_tester_email = row.assigned_tester_email;
        }
        return request;
      });
      res.status(200).json({ requests });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTestRequestHistory = async (req, res) => {
  try {
    const { customer_id } = req.body;

    // Query to fetch test request history for the specified customer with tester details
    const query = `
      SELECT trh.request_id, trh.request_name, trh.status, 
             t.name AS assigned_tester_name, t.email AS assigned_tester_email
      FROM testing_request_history trh
      LEFT JOIN tester t ON trh.tester_id = t.tester_id
      WHERE trh.customer_id = $1`;

    const { rows } = await db.query(query, [customer_id]);
    console.log(rows)
    if (rows.length === 0) {
      return res.status(404).json({ error: 'No test request history found for the specified customer' });
    } else {
      const historyData = rows.map(row => ({
        requestId: row.request_id,
        requestName: row.request_name,
        status: row.status,
        assignedTesterName: row.assigned_tester_name,
        assignedTesterEmail: row.assigned_tester_email
      }));
      return res.status(200).json({ historyData });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
