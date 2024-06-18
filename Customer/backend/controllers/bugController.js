// controllers/bugController.js
const db = require('../models/db');

exports.getcurrentbug = async (req, res) => {
  try {
    const { customerId } = req.body; // Assuming the customer ID is sent in the request body

    const query = `
      SELECT bug_id, summary, feature_workflow, steps_to_reproduce, severity, status,bug_tester_comment
      FROM bug
      WHERE customer_id = $1;
    `;
    const bugs = await db.query(query, [customerId]);
    res.status(200).json({ bugs: bugs.rows });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateBugStatus = async (req, res) => {
  try {
      const { customerId, bugId, status, comment } = req.body;

      // Perform database update operation here
      // Example: Update the status and comment of the bug with the given id and customer id
      if (comment) {
          await db.query('UPDATE bug SET status = $1, bug_customer_comment = $2 WHERE bug_id = $3 AND customer_id = $4', [status, comment, bugId, customerId]);
      } else {
          await db.query('UPDATE bug SET status = $1 WHERE bug_id = $2 AND customer_id = $3', [status, bugId, customerId]);
      }

      res.status(200).json({ message: 'Bug status updated successfully' });
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};

  exports.getbughistory = async (req, res) => {
    const { customerId } = req.body;

    try {
        const bugHistoryQuery = `
            SELECT bug_id, request_id, summary, status, completed_at
            FROM bug_history
            WHERE customer_id = $1
        `;
        const bugHistoryValues = [customerId];
        const { rows } = await db.query(bugHistoryQuery, bugHistoryValues);
        res.status(200).json({ bugHistory: rows });
    } catch (error) {
        console.error('Error fetching bug history:', error);
        res.status(500).json({ error: 'Error fetching bug history' });
    }
};
