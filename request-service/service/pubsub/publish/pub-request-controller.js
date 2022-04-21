const Logger = require('../../logger/logger');
const log = new Logger('Register-Dao');
const { PubSub } = require('@google-cloud/pubsub');
const pubSubRepo = require('../pub-sub-repo');
require('dotenv').config()

const pubSubClient = new PubSub({ projectId: process.env.GOOGLE_PROJECT_ID });
const topicName = process.env.GOOGLE_PUBSUB_TOPIC;
const { publishMessage } = pubSubRepo;

const request = (req, res) => {
  return res.send({
    success: true,
    message: `Publish Request route confirmed!`
  });
}

const createRequest = async (req, res) => {
  let requestObj = req.body;
  let messageId = await publishMessage(pubSubClient, topicName, requestObj);
  
  return res.send({
    success: true,
    message: `Message ${messageId} published`
  });
}

module.exports = {
    request,
    createRequest
}