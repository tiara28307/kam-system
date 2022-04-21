
const publishMessage = async (pubSubClient, topicName, payload) => {
  const dataBuffer = Buffer.from(JSON.stringify(payload));
  const messageId = await pubSubClient.topic(topicName).publish(dataBuffer);
  console.log(`Message ${messageId} published.`);
  return messageId;
}

const listenPullMessages = (pubSubClient, subscriptionName, timeout) => {
  const subscription = pubSubClient.subscription(subscriptionName);
  var messageCount = 0;
  
  const messageHandler = message => {
    console.log(`Received message ${message.id}:`);
    console.log(`\tData: ${message.data}`);
    console.log(`\tAttributes: ${message.attributes}`);
    messageCount += 1;
    message.ack();
  }

  subscription.on('message', messageHandler);
  setTimeout(() => {
    subscription.removeListener('message', messageHandler);
    console.log(`${messageCount} message(s) received`);
  }, timeout * 1000);
}

const listenPushMessages = (payload) => {
  const message = Buffer.from(payload, 'base64').toString(
      'utf-8'
  );
  const parsedMessage = JSON.parse(message);
  console.log(parsedMessage);
  return parsedMessage;
}

module.exports = {
  publishMessage,
  listenPullMessages,
  listenPushMessages
}
