const express = require('express');
const cors = require('cors');
const pool = require('./db');
const customerroute=require('./routes/customerroute')
const managerroute=require('./routes/managerroute')
const testerroute=require('./routes/testerroute')

const app=express();
app.use(express.json());

app.use(cors())
app.use('/api/v1/customer',customerroute);
app.use('/api/v1/projectmanager',managerroute);
app.use('/api/v1/tester',testerroute);
    
app.listen(4000,()=>{
    console.log("Server runs on 4000")
})