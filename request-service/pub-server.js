const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('./cors');
require('dotenv').config()

const environment = process.env.NODE_ENV;

app.use(express.json());
app.use(cors.accessControl);

// Request Service for Publisher
const pubRequestServiceRouter = require('./service/publish/pub-request-router');
app.use('/kyc/request', pubRequestServiceRouter);

// DEV env enable HTTP request logger middleware morgan
if(environment === 'development'){
    app.use(morgan('tiny'));
    console.log('Morgan is enabled...');
}

const port = process.env.PORT_1 || 8083;

app.listen(port, ()=>{
    console.log(`Application running in ${environment} environment, listening to port ${port}....`);
});