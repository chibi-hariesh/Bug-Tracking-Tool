const express = require('express');
const {adduser , loginuser} = require('../controller/customercontroler.js')
const router = express.Router();

router.post('/adduser', adduser);

router.post('/loginuser',loginuser)


module.exports = router;