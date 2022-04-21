const express = require('express');
const app = express();
const http = require('http').createServer(app);
const morgan = require('morgan');
const cors = require('./cors');
require('dotenv').config();
var io = require('socket.io')(http);

const environment = process.env.NODE_ENV;

app.use(express.json());
app.use(cors.accessControl);

// KYC Request Service
const kycRequestServiceRouter = require('./service/kyc-request-router');
app.use('/', kycRequestServiceRouter);

io.attach(app, {
  // includes local domain to avoid CORS error locally
  // configure it accordingly for production
  cors: {
    origin: 'http://localhost',
    methods: ['GET', 'POST'],
    credentials: true,
    transports: ['websocket', 'polling'],
  },
  allowEIO3: true,
})

io.on('connection', (socket) => {
  console.log('👾 New socket connected! >>', socket.id)
})

// DEV env enable HTTP request logger middleware morgan
if(environment === 'development'){
    app.use(morgan('tiny'));
    console.log('Morgan is enabled...');
}

const port = process.env.PORT || 8083;

app.listen(port, ()=>{
    console.log(`Application running in ${environment} environment, listening to port ${port}....`);
});
