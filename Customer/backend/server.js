const express = require('express');
const cors = require('cors'); // Require the cors middleware
const app = express();
const authRoutes = require('./routes/authRoutes');
const testrequestRoutes = require('./routes/testrequestRoute');
const bugRoutes = require('./routes/bugRoutes');

app.use(express.json());
app.use(cors()); // Use the cors middleware to enable CORS

// Routes
app.use('/auth', authRoutes);
app.use('/testrequest', testrequestRoutes);
app.use('/bug',bugRoutes)

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
