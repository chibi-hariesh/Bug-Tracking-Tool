const pool = require('../db');
const express = require('express');
const app = express();
const jwt = require('jsonwebtoken')


//register
const bcrypt = require('bcrypt');

const adduser = async (req, res) => {
    try {
        const { email, password, full_name } = req.body;

        // Check if the email already exists
        const emailCheckQuery = `SELECT * FROM customer WHERE email = '${email}'`;
        const existingUser = await pool.query(emailCheckQuery);

        if (existingUser.rows.length > 0) {
            // Email already registered
            console.log("Email already registered");
            res.status(409).send("Email already registered");
            return;
        }

        // Encrypt the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // If the email doesn't exist, proceed with the insertion
        const insertQuery = `INSERT INTO customer (email, password, full_name) VALUES ('${email}', '${hashedPassword}', '${full_name}')`;
        await pool.query(insertQuery);

        console.log("Data saved successfully");
        res.send("Data saved successfully");
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

//login 
const loginuser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user exists
        const userQuery = `SELECT * FROM customer WHERE email = '${email}'`;
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
            'otha', // Replace with a strong secret key
            { expiresIn: '7d' }
        );

        // Login successful, send the JWT as a response
        console.log("Login successful");
        res.json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = { adduser, loginuser };