// controllers/authController.js
const db = require('../models/db');
const Customer = require('../models/customer');

exports.register = async (req, res) => {
  const { email, password, customer_name } = req.body;
  try {
    const customer = await Customer.create(email, password, customer_name);
    res.status(201).json({ customer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (email === '' || password === '') {
      return res.status(404).json({ error: 'Invalid credentials' }); // Return response instead of sending it directly
    }
    const customer = await Customer.findByCredentials(email, password);
    if (!customer) {
      return res.status(401).json({ error: 'Invalid credentials' }); // Return response instead of sending it directly
    }
    res.status(200).json({ customer }); // Send response only if authentication is successful
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
