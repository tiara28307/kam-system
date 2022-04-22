const Logger = require('./logger/logger');
const log = new Logger('Web3-Storage');
const process = require('process');
const minimist = require('minimist');
const { Web3Storage, getFilesFromPath } = require('web3.storage');
const web3Utils = require('./utils/web3-utils');

/* 
  Uploads file(s) to Web3 Storage - Blockchain storage service
  Returns the content identifier to retrieve file(s)
*/
async function storeFilesBlockchain() {
  const args = minimist(process.argv.slice(2));
  const token = args.token;

  if (!token) {
    return log.error('A token is needed. You can create one on https://web3.storage');
  }

  if (args._.length < 1) {
    return log.error('Invalid path to file or directory');
  }

  const storage = new Web3Storage({ token });
  const files = [];

  for (const path of args._) {
    const pathFiles = await getFilesFromPath(path);
    files.push(...pathFiles);
  }

  log.warn(`Uploading ${files.length} files`);
  const cid = await storage.put(files);
  console.log(`application cid: `, cid);
  web3Utils.applicationCID.setCID(cid);
  log.warn('Application was successfully added to blockchain');
}

storeFilesBlockchain();