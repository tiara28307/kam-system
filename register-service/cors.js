const express = require('express');
const cors = require('cors');
const app = express();
const whitelist = ['https://localhost:4200'];

// CORS Access Control for Whitelisted Origins
var corsOptionDelegate = (req, callback) => {
  var corsOptions;

  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin:true };
  } else {
    corsOptions = { origin:false };
  }
  callback(null, corsOptions);
}

//CORS middleware
var accessControl = (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:4200");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-auth-token");
  res.header("Access-Control-Expose-Headers", "x-auth-token");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Credentials", "true");
  // res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  next();
}

exports.cors = cors();
exports.corsOptionsDelegate = cors(corsOptionDelegate);
exports.accessControl = accessControl;