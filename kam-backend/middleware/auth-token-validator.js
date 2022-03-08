const jwt = require('jsonwebtoken');
require('dotenv').config();

const secretKey = getJwtSecretKey();

function getJwtSecretKey() {
    try {
        return process.env.JWT_SECRET_KEY;
    } catch (err) {
        console.error('\x1b[31mUnable to start application without JWT secret key. Please set JWT-secretkey in environment variable and try again.\x1b[0m');
        process.exit(0);
    }
}

module.exports = function (req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) {
        return res.status(400).send({
            message: 'Access denied. Authentication token not found.',
            messageCode: 'TKNERR'
        });
    }
    try {
        const payload = jwt.verify(token, secretKey);
        next();
    } catch (err) {
        return res.status(400).send({
            message: 'Access denied. Invalid authentication token.',
            messageCode: 'INVTKN'
        });
    }
}