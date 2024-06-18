// routes/customerRoutes.js
const express = require('express');
const testrequestRoute = express.Router();
const testrequestController = require('../controllers/testrequestController');

testrequestRoute.post('/raiserequests', testrequestController.createRequest);
testrequestRoute.post('/getcurrentrequest', testrequestController.getCurrentRequestStatus);
testrequestRoute.post('/getrequesthistory',testrequestController.getTestRequestHistory)

module.exports = testrequestRoute;
