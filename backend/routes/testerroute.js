const express = require('express');
const router = express.Router();

// Import controller functions
const { testerLogin, getTestRequestsForTester, getTestRequestDetails, createBug,
        getBugsByRequestId, updateBugStatus, startTesting } = require('../controller/testercontroller');

// Define routes
router.post('/testerlogin', testerLogin); // Route for tester login

// Route to handle fetching test requests for a specific tester
router.get('/:testerId/testrequests', getTestRequestsForTester);

// Route to start testing
router.put('/:requestId/start-testing', startTesting);

// Route to fetch test request details by request_id
router.get('/test-details/:requestId', getTestRequestDetails);

// Route for bug creation
router.post('/create-bugs', createBug);

// Route to retrieve bugs by request_id
router.post('/bug-list/:requestId', getBugsByRequestId);


// Route to update bug status
router.put('/bug-status-update/:bugId', updateBugStatus);





module.exports = router;
