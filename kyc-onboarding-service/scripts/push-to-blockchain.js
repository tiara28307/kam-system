const { exec } = require('child_process');
const Logger = require('../logger/logger');
const log = new Logger('Store-Files-Blockchain-Script');

async function pushFilesToBlockchain(fileDir) {
  const apiToken = process.env.WEB3_STORAGE_TOKEN;

  exec(`node web3-storage.js --token=${apiToken} ${fileDir}`, (error, stdout, stderr) => {
    if (error) {
      log.error(`Web3 Cmd Error: ${error.message}`);
      return;
    }
    if (stderr) {
      log.error(`Web3 Std Error: ${stderr}`);
      return;
    }
    log.info(`stdout: ${stdout}`);
    return stdout;
  })
}

module.exports = {
  pushFilesToBlockchain
}
