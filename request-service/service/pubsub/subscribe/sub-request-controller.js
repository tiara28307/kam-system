const Logger = require('../../../logger/logger');
const log = new Logger('Register-Dao');
const { PubSub } = require('@google-cloud/pubsub');
const pubSubRepo = require('../pub-sub-repo');
require('dotenv').config()

const pubSubClient = new PubSub({ projectId: process.env.GOOGLE_PROJECT_ID });
const subscriptionName = 'kam-request-topic-sub'; // "request_sub";
const timeout = 60;
const { listenPullMessages, listenPushMessages  } = pubSubRepo;

const subscribeRequestHome = (req, res) => {
  return res.send({
    success: true,
    message: `Subscriber Request route confirmed!`
  });
}

const pullRequest = (req, res) => {
  try {
    listenPullMessages(pubSubClient, subscriptionName, timeout);
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: 'Failed to receive request',
      data: error
    });
  }
}

const pushRequest = async (req, res) => {
  try {
    let messageResponse = await listenPushMessages(req.body.message.data);
    return res.send({
      success: true,
      message: `Message received successfully`,
      data: messageResponse
    });
  } catch (error) {
    return res.status(400).send({
      success: false,
      message: 'Failed to receive push request',
      data: error
    });
  }
}

module.exports = {
  subscribeRequestHome,
  pullRequest,
  pushRequest
}
