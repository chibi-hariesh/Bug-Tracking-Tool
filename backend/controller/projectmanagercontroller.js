const pool = require('../db');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const managerlogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const userQuery = `SELECT * FROM projectmanager WHERE email = '${email}'`;
    const result = await pool.query(userQuery);
    const user = result.rows[0];

    if (!user) {
      // User not found
      console.log("User not found");
      res.status(401).send("Invalid email or password");
      return;
    }

    // Compare the provided password with the hashed password from the database
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      // Passwords do not match
      console.log("Invalid password");
      res.status(401).send("Invalid email or password");
      return;
    }

    // Generate JWT with user data (excluding password) and set expiration to 7 days
    const token = jwt.sign(
      {
        user_id: user.customer_id,
        email: user.email,
        full_name: user.full_name,
      },
      'qwertyuiop', // Replace with a strong secret key
      { expiresIn: '7d' }
    );

    // Login successful, send the JWT as a response
    console.log("Login successful");
    res.status(200).send({
      success: true,
      message: "Login successfull",
      user: {
        manager_id: user.manager_id,
        name: user.name,
        email: user.email,
      },
      token
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};

//view all customer accept=false manager request
const view = async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT t.request_id, c.customer_name, t.status, t.accepted FROM testingrequest t JOIN customer c ON t.customer_id = c.customer_id WHERE t.accepted = false');
    client.release();
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Fetch Available Testers API
const fetchAvailableTesters = async (req, res) => {
  try {
    // Fetch available testers who do not have any assigned requests
    const availableTesters = await pool.query(`
          SELECT tester.tester_id, tester.name, tester.email
          FROM tester
          LEFT JOIN request_acceptance ra ON tester.tester_id = ra.tester_id
          WHERE ra.tester_id IS NULL
      `);

    if (availableTesters.rows.length === 0) {
      res.status(400).json({ error: 'No available testers found' });
      return;
    }

    // Respond with the list of available testers
    res.status(200).json({ testers: availableTesters.rows });
  } catch (error) {
    console.error('Error fetching available testers:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

//view of available tester
const available_assign = async (req, res) => {
  // API endpoint to assign a request to an available tester and insert their details into the request_acceptance table
  const { requestId, customerId } = req.body;

  try {
    // Fetch available testers
    const availableTesters = await pool.query(`
        SELECT tester.tester_id
        FROM tester
        LEFT JOIN request_acceptance ra ON tester.tester_id = ra.tester_id
        WHERE ra.tester_id IS NULL
      `);

    if (availableTesters.rows.length === 0) {
      res.status(400).json({ error: 'No available testers found' });
      return;
    }

    // Select the first available tester
    const testerId = availableTesters.rows[0].tester_id;

    // Insert into request_acceptance table
    await pool.query(`
        INSERT INTO request_acceptance (request_id, customer_id, tester_id)
        VALUES ($1, $2, $3)
      `, [requestId, customerId, testerId]);

    // Update status in testingrequest table to "Request Accepted"
    await pool.query(`
        UPDATE testingrequest
        SET status = 'Request Accepted'
        WHERE request_id = $1
      `, [requestId]);

    res.json({ message: 'Request assigned to the tester successfully' });
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

//manager request update accept
const update_accepted = async (req, res) => {
  const requestId = req.params.requestId;

  try {
    const client = await pool.connect();
    const result = await client.query('UPDATE testingrequest SET accepted = true WHERE request_id = $1', [requestId]);
    client.release();

    if (result.rowCount === 1) {
      res.status(200).json({ message: 'Accepted field updated successfully' });
    } else {
      res.status(404).json({ error: 'Request not found' });
    }
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).json({ error: 'Internal server error' });
  }
}
//Testing Completed

// Retrieve data from testingrequest table where accepted is true
// If status is not "Under Review", retrieve tester name and customer name from request_acceptance table
const under_review_accepted = async (req, res) => {
  try {
    const client = await pool.connect();
    const query = `
      SELECT tr.*, 
             c.customer_name,
             t.tester_id,
             t.name AS tester_name
      FROM testingrequest tr
      LEFT JOIN customer c ON tr.customer_id = c.customer_id
      LEFT JOIN (
          SELECT ra.request_id, t.tester_id, t.name
          FROM request_acceptance ra
          LEFT JOIN tester t ON ra.tester_id = t.tester_id
      ) t ON tr.request_id = t.request_id
      WHERE tr.accepted = true;
    `;
    const { rows } = await client.query(query);

    // Handling "Not Assigned" for tester_name if tester_id is NULL
    const formattedRows = rows.map(row => ({
      ...row,
      tester_name: row.tester_id ? row.tester_name : 'Not Assigned'
    }));

    client.release();
    res.json({ data: formattedRows });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
// assign tester
const updateStatusAndAssignTester = async (req, res) => {
  try {
    const { request_id, status ,tester_id } = req.body;

    // Update status in the testingrequest table
    const client = await pool.connect();
    await client.query('UPDATE testingrequest SET status = $1 WHERE request_id = $2', [status, request_id]);

    // Insert values into the request_acceptance table
    await client.query('INSERT INTO request_acceptance (request_id, customer_id, tester_id) VALUES ($1, (SELECT customer_id FROM testingrequest WHERE request_id = $1), $2)', [request_id, tester_id]);

    client.release();

    res.status(200).json({ message: 'Status updated and tester assigned successfully' });
  } catch (error) {
    console.error('Error updating status and assigning tester:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};





// API endpoint to update the status to "Testing Completed" in the testingrequest table
const retrieveData = async (req, res) => {
  try {
    // Query to retrieve tester name, customer name, and status where acceptance is true
    const query = `
      SELECT
          r.request_id,
          c.customer_name,
          t.tester_name,
          tr.status
      FROM
          request_acceptance ra
      JOIN
          customer c ON ra.customer_id = c.customer_id
      JOIN
          testingrequest tr ON ra.request_id = tr.request_id
      JOIN
          tester t ON ra.tester_id = t.tester_id
      WHERE
          ra.accepted = true;
    `;

    // Execute the query
    const { rows } = await pool.query(query);

    // Return the retrieved data as JSON
    res.json({ data: rows });
  } catch (error) {
    console.error('Error retrieving data:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

//bolck testing
const blockTesting = async (req, res) => {
  try {
    const { id, reason } = req.body;

    // Update block_reason and status in the testingrequest table
    const client = await pool.connect();
    await client.query('UPDATE testingrequest SET block_reason = $1, status = $2 WHERE request_id = $3', [reason, 'Testing Blocked', id]);

    client.release();

    res.status(200).json({ message: 'Testing blocked successfully' });
  } catch (error) {
    console.error('Error blocking testing:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

//resume testing
const resumeTesting = async (req, res) => {
  try {
    const { id } = req.body;

    // Update block_reason to null and status to 'Testing In Progress' in the testingrequest table
    const client = await pool.connect();
    await client.query('UPDATE testingrequest SET block_reason = NULL, status = $1 WHERE request_id = $2', ['Testing In Progress', id]);

    client.release();

    res.status(200).json({ message: 'Testing resumed successfully' });
  } catch (error) {
    console.error('Error resuming testing:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const testing_completed = async (req, res) => {
  try {
    const requestId = req.params.requestId;

    // Check if the current status is not already "Testing Completed"
    const checkStatus = await pool.query(`
      SELECT status
      FROM testingrequest
      WHERE request_id = $1
    `, [requestId]);

    if (checkStatus.rows.length === 0) {
      res.status(404).json({ error: 'Request not found' });
      return;
    }

    const currentStatus = checkStatus.rows[0].status;

    if (currentStatus === 'Testing Completed') {
      res.status(400).json({ error: 'Status is already Testing Completed and cannot be modified' });
      return;
    }

    // Update the status to "Testing Completed" and delete corresponding rows from request_acceptance table
    await pool.query(`
      DELETE FROM request_acceptance
      WHERE request_id = $1
    `, [requestId]);

    await pool.query(`
      UPDATE testingrequest
      SET status = 'Testing Completed'
      WHERE request_id = $1
    `, [requestId]);

    // Retrieve data from testingrequest where status is Testing Completed
    const completedRequests = await pool.query(`
      SELECT *
      FROM testingrequest
      WHERE status = 'Testing Completed'
    `);

    // Insert data into testing_request_history
    for (const request of completedRequests.rows) {
      const { request_id, request_name, tester_id, customer_id, status } = request;

      // Insert data into testing_request_history table
      await pool.query(`
        INSERT INTO testing_request_history (request_id, request_name, tester_id, customer_id, status)
        VALUES ($1, $2, $3, $4, $5)
      `, [request_id, request_name, tester_id, customer_id, status]);
    }

    // Truncate testingrequest table
    await pool.query(`
      TRUNCATE TABLE testingrequest CASCADE
    `);

    res.json({ message: 'Testing completed requests processed successfully' });
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};




//Testing In Progress
const testinginprogress = async (req, res) => {
  const requestId = req.params.requestId;

  try {
    // Check if the current status is "Testing Blocked" or "Testing Accepted"
    const checkStatus = await pool.query(`
      SELECT status
      FROM testingrequest
      WHERE request_id = $1
    `, [requestId]);

    if (checkStatus.rows.length === 0) {
      res.status(404).json({ error: 'Request not found' });
      return;
    }

    const currentStatus = checkStatus.rows[0].status;

    if (currentStatus !== 'Request Accepted' && currentStatus !== 'Testing Blocked') {
      res.status(400).json({ error: 'Status is not Testing Accepted or Testing Blocked and cannot be updated' });
      return;
    }

    // Update the status to "Testing In Progress"
    await pool.query(`
      UPDATE testingrequest
      SET status = 'Testing In Progress'
      WHERE request_id = $1
    `, [requestId]);

    res.json({ message: 'Status updated to Testing In Progress successfully' });
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


// API endpoint to update the status in testingrequest table to "Testing Blocked"
const blocked = async (req, res) => {
  const requestId = req.params.requestId;

  try {
    // Check if the current status is "Testing In Progress"
    const checkStatus = await pool.query(`
      SELECT status
      FROM testingrequest
      WHERE request_id = $1
    `, [requestId]);

    if (checkStatus.rows.length === 0) {
      res.status(404).json({ error: 'Request not found' });
      return;
    }

    const currentStatus = checkStatus.rows[0].status;

    if (currentStatus !== 'Testing In Progress') {
      res.status(400).json({ error: 'Status is not Testing In Progress and cannot be updated' });
      return;
    }

    // Update the status to "Testing Blocked"
    await pool.query(`
      UPDATE testingrequest
      SET status = 'Testing Blocked'
      WHERE request_id = $1
    `, [requestId]);

    res.json({ message: 'Status updated to Testing Blocked successfully' });
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const processTestingRequest = async (req, res) => {
  try {
    const { requestId, status } = req.body;

    // Fetch the request details including the tester ID from request_acceptance table
    const query = `
      SELECT tr.request_id, tr.request_name, ra.tester_id, tr.customer_id, tr.status
      FROM testingrequest tr
      LEFT JOIN request_acceptance ra ON tr.request_id = ra.request_id
      WHERE tr.request_id = $1
    `;
    const { rows } = await pool.query(query, [requestId]);

    // Check if the request is found
    if (rows.length === 0) {
      res.status(404).json({ error: 'Request not found' });
      return;
    }

    const requestDetails = rows[0];

    // Insert the request details into testing_request_history table
    await pool.query(
      'INSERT INTO testing_request_history (request_id, request_name, tester_id, customer_id, status) VALUES ($1, $2, $3, $4, $5)',
      [requestDetails.request_id, requestDetails.request_name, requestDetails.tester_id, requestDetails.customer_id, status]
    );

    // Delete the request from request_acceptance table
    await pool.query('DELETE FROM request_acceptance WHERE request_id = $1', [requestId]);

    // Delete the request from testingrequest table
    await pool.query('DELETE FROM testingrequest WHERE request_id = $1', [requestDetails.request_id]);

    // Check if there are any bugs associated with the request in the bug table
    const bugQuery = `
      SELECT bug_id, bug_name, request_id, customer_id, tester_id, summary,status
      FROM bug
      WHERE request_id = $1
    `;
    const bugs = await pool.query(bugQuery, [requestId]);

    // If bugs are found, insert them into the bug_history table and delete them from the bug table
    if (bugs.rows.length > 0) {
      for (const bug of bugs.rows) {
        await pool.query(
          'INSERT INTO bug_history (bug_id, bug_name, request_id, customer_id, tester_id, summary,status) VALUES ($1, $2, $3, $4, $5, $6,$7)',
          [bug.bug_id, bug.bug_name, bug.request_id, bug.customer_id, bug.tester_id, bug.summary,bug.status]
        );
      }

      await pool.query('DELETE FROM bug WHERE request_id = $1', [requestId]);
    }

    res.status(200).json({ message: 'Testing request processed successfully' });
  } catch (error) {
    console.error('Error processing testing request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const ManageTester = async (req, res) => {
  try {
    // Fetch all testers' details
    const query = `
      SELECT tester.tester_id, tester.name, tester.email, ra.customer_id
      FROM tester
      LEFT JOIN request_acceptance ra ON tester.tester_id = ra.tester_id
    `;
    const { rows } = await pool.query(query);

    // Classify testers as available or not available
    const testers = rows.map(row => ({
      tester_id: row.tester_id,
      name: row.name,
      email: row.email,
      availability: row.customer_id ? 'Not Available' : 'Available',
      customer_id: row.customer_id
    }));

    // If tester is not available, fetch customer name
    for (const tester of testers) {
      if (tester.availability === 'Not Available') {
        const customerQuery = 'SELECT customer_name FROM customer WHERE customer_id = $1';
        const customerResult = await pool.query(customerQuery, [tester.customer_id]);
        tester.customer_name = customerResult.rows[0].customer_name;
      }
    }

    res.status(200).json({ testers });
  } catch (error) {
    console.error('Error fetching testers:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const fetchCustomerDetails = async (req, res) => {
  try {
    // Fetch all customer IDs, names, and emails from the customer table
    const customerQuery = `
      SELECT customer_id, customer_name, email
      FROM customer
    `;
    const customerResult = await pool.query(customerQuery);
    const customers = customerResult.rows;

    // Iterate over each customer to fetch additional details
    const customerDetails = await Promise.all(customers.map(async (customer) => {
      const { customer_id, customer_name, email } = customer;

      // Check if the customer ID is present in the request_acceptance table
      const requestQuery = `
        SELECT request_id, tester_id
        FROM request_acceptance
        WHERE customer_id = $1
      `;
      const requestResult = await pool.query(requestQuery, [customer_id]);

      if (requestResult.rows.length === 0) {
        // Customer ID not present in request_acceptance table
        return {
          customer_id,
          customer_name,
          email,
          tester_name: 'Yet to Assign',
          status: 'Yet to Assign'
        };
      }

      // Customer ID present in request_acceptance table, fetch additional details
      const { request_id, tester_id } = requestResult.rows[0];
      
      // Fetch status from the testingrequest table using the request ID
      const statusQuery = `
        SELECT status
        FROM testingrequest
        WHERE request_id = $1
      `;
      const statusResult = await pool.query(statusQuery, [request_id]);

      if (statusResult.rows.length === 0) {
        throw new Error('Status not found');
      }

      const status = statusResult.rows[0].status;

      // Fetch tester name from the tester table using the tester ID
      const testerQuery = `
        SELECT name
        FROM tester
        WHERE tester_id = $1
      `;
      const testerResult = await pool.query(testerQuery, [tester_id]);

      if (testerResult.rows.length === 0) {
        throw new Error('Tester not found');
      }

      const tester_name = testerResult.rows[0].name;

      return {
        customer_id,
        customer_name,
        email,
        tester_name,
        status
      };
    }));

    res.status(200).json({ customers: customerDetails });
  } catch (error) {
    console.error('Error fetching customer details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
const fetchTestingRequestHistory = async (req, res) => {
  try {
    // Fetch request_id, request_name, status, customer_name, and tester_name from testing_request_history table
    const query = `
      SELECT trh.request_id, trh.request_name, trh.status, c.customer_name, t.name AS tester_name
      FROM testing_request_history trh
      LEFT JOIN customer c ON trh.customer_id = c.customer_id
      LEFT JOIN tester t ON trh.tester_id = t.tester_id
    `;
    const { rows } = await pool.query(query);

    // Return the fetched data
    res.status(200).json({ testing_request_history: rows });
  } catch (error) {
    console.error('Error fetching testing request history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


const getBugHistoryById = async (req, res) => {
  try {
    const { request_id } = req.params;

    // Fetch specific fields from bug_history table based on request_id
    const query = `
      SELECT bug_name, request_id, customer_id, tester_id, summary, status, completed_at
      FROM bug_history
      WHERE request_id = $1
    `;
    const { rows } = await pool.query(query, [request_id]);

    // Return the fetched data
    res.status(200).json({ bug_history: rows });
  } catch (error) {
    console.error('Error fetching bug history:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
// API to move testing request to history and truncate from testingrequest table
const reject = async (req, res) => {
  try {
    const { request_id } = req.body; // Extract request_id from the request body
    const { status } = req.body; // Extract status from the request body

    // Retrieve testing request data
    const getRequestQuery = 'SELECT * FROM testingrequest WHERE request_id = $1';
    const { rows } = await pool.query(getRequestQuery, [request_id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Testing request not found' });
    }

    // Insert data into testing_request_history
    const request = rows[0];
    const insertQuery = `
      INSERT INTO testing_request_history (request_id, request_name, tester_id, customer_id, status)
      VALUES ($1, $2, $3, $4, $5)
    `;
    await pool.query(insertQuery, [request.request_id, request.request_name, request.tester_id, request.customer_id, status]);

    // Truncate testing request from testingrequest table
    const truncateQuery = 'DELETE FROM testingrequest WHERE request_id = $1';
    await pool.query(truncateQuery, [request_id]);

    res.json({ message: 'Testing request moved to history and truncated successfully' });
  } catch (error) {
    console.error('Error moving testing request to history:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


module.exports = {getBugHistoryById,fetchTestingRequestHistory,fetchCustomerDetails,ManageTester,processTestingRequest,resumeTesting,blockTesting,updateStatusAndAssignTester,under_review_accepted, update_accepted, managerlogin, fetchAvailableTesters, retrieveData, view, available_assign, testing_completed, testinginprogress, blocked,reject }