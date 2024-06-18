const express = require('express');
const bugRoutes = express.Router();
const bugController = require('../controllers/bugController');

bugRoutes.post('/getcurrentbug', bugController.getcurrentbug);
bugRoutes.post('/updatebugstatus', bugController.updateBugStatus);
bugRoutes.post('/getbughistory', bugController.getbughistory);


module.exports = bugRoutes;