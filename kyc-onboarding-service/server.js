const express = require('express');
const app = express();
const morgan = require('morgan');
const cors = require('./cors');
require('dotenv').config()

const environment = process.env.NODE_ENV;

app.use(express.json());
app.use(cors.accessControl);

// KYC Onboarding Service
const kycOnboardingServiceRouter = require('./service/kyc-onboarding-router');
app.use('/kyc/onboarding', kycOnboardingServiceRouter);

// DEV env enable HTTP request logger middleware morgan
if(environment === 'development'){
    app.use(morgan('tiny'));
    console.log('Morgan is enabled...');
}

const port = process.env.PORT || 8082;

app.listen(port, ()=>{
    console.log(`Application running in ${environment} environment, listening to port ${port}....`);
});
