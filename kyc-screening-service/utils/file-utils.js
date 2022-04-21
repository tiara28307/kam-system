const fs = require('fs');

function createApplicationDecisionFileObject(applicationId, appObj) {
  const jsonObj = JSON.stringify(appObj);
  const filePath = `./uploads/application/decisions/${applicationId}.json`;
  const file = fs.writeFileSync(filePath, jsonObj, 'utf8', (err) => {
    if (err) {
      console.error('Error unable to write JSON object file: ', err);
    }
  });
  return file;
}

module.exports = {
  createApplicationDecisionFileObject
}
