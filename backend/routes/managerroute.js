const express = require('express')
const router = express.Router();
const {getBugHistoryById,fetchTestingRequestHistory,fetchCustomerDetails,ManageTester,processTestingRequest,resumeTesting,blockTesting,updateStatusAndAssignTester,under_review_accepted,update_accepted, managerlogin,retrieveData,fetchAvailableTesters , view, available_assign, testing_completed, testinginprogress, blocked,reject } = require('../controller/projectmanagercontroller')

router.post('/managerlogin',managerlogin)
router.get('/view',view)
router.get('/ManageTester',ManageTester )
router.put('/update-accepted/:requestId',update_accepted)
router.get('/under_review_accepted',under_review_accepted)
router.get('/fetchAvailableTesters',fetchAvailableTesters)
router.post('/assign/request',available_assign)
router.put('/testingrequest/:requestId/status',testing_completed)
router.put('/request/:requestId/status',testinginprogress)
router.put('/blocked/:requestId/status',blocked)
router.get('/retrieveData',retrieveData);
router.post('/updateStatusAndAssignTester',updateStatusAndAssignTester)
router.post('/blockTesting',blockTesting);
router.post('/resumeTesting',resumeTesting);
router.post('/processTestingRequest',processTestingRequest)
router.get('/fetchCustomerDetails',fetchCustomerDetails)
router.get('/fetchTestingRequestHistory',fetchTestingRequestHistory)
router.get('/bug-history/:request_id', getBugHistoryById)
router.post('/reject',reject)
module.exports = router