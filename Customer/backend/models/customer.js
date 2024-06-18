const bcrypt = require('bcrypt');
const db = require('./db');

class Customer {
  static async create(email, password, customer_name) {
    try {
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10); // 10 is the saltRounds
      
      const query = 'INSERT INTO "customer" (email, password, customer_name) VALUES ($1, $2, $3) RETURNING *';
      const values = [email, hashedPassword, customer_name];
      
      const { rows } = await db.query(query, values);
      return rows[0];
    } catch (error) {
      throw new Error('Error creating customer: ' + error.message);
    }
  }

  static async findByCredentials(email, password) {
    const query = 'SELECT customer_id, email, password,customer_name FROM "customer" WHERE email = $1';
    const values = [email];
    try {
      const { rows } = await db.query(query, values);
      if (rows.length === 0) {
        throw new Error('Customer not found');
      }
      
      // Compare hashed password with input password
      const isPasswordMatch = await bcrypt.compare(password, rows[0].password);
      if (!isPasswordMatch) {
        throw new Error('Incorrect password');
      }
      
      return rows[0];
    } catch (error) {
      throw new Error('Error finding customer by credentials: ' + error.message);
    }
  }
}

module.exports = Customer;
