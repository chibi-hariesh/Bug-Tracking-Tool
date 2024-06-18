const { Pool } = require('pg');

const pool = new Pool({
    user: "postgres",
    password: "2003",
    host: "localhost",
    port: 5432,
    database: 'bug_tracking'
});

// Check connection status
pool.connect()
    .then(() => {
        console.log("Connected to database");
    })
    .catch((err) => {
        console.error("Failed to connect to database:", err);
    });

module.exports = pool;
