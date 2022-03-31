const express = require('express');
const app = express();
const morgan = require('morgan');
require('dotenv').config()

const environment = process.env.NODE_ENV

app.use(express.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:4200");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-auth-token");
  res.header("Access-Control-Expose-Headers", "x-auth-token");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  next();
});

// Email Service
const emailServiceRouter = require('./services/email-service/email-router');
app.use('/email', emailServiceRouter);

// Register Service
const registerServiceRouter = require('./services/register-service/register-router');
app.use('/register', registerServiceRouter);

// KYC Onboarding Service
const kycOnboardingServiceRouter = require('./services/kyc-onboarding-service/kyc-onboarding-router');
app.use('/kyc/onboarding', kycOnboardingServiceRouter);

if(environment === 'development'){
    app.use(morgan('tiny'));
    console.log('Morgan is enabled...');
}

// PORT can be set in environment variable
const port = process.env.PORT || 8081;

app.listen(port, ()=>{
    console.log(`Application running in ${environment} environment, listening to port ${port}....`);
});