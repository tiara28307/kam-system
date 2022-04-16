const { Web3Storage } = require('web3.storage');
const Logger = require('../logger/logger');
const log = new Logger('Web3-Storage');

const apiToken = process.env.WEB3_STORAGE_TOKEN;
const Web3Client = new Web3Storage({ token: apiToken });

const fileInputDetails = {
  applicationId: '',
  files: [],
  fileType: '',

  set appId(id) {
    this.applicationId = id;
  },

  set fileList(kycDocumentFiles) {
    this.files = kycDocumentFiles;
  },

  set kycFileType(type) {
    this.fileType = type;
  }
}

const rootCid = async () => {
  try {
    return await Web3Client.put(fileInputDetails.files, {
      name: `${fileInputDetails.applicationId}_${fileInputDetails.fileType}_document`,
      maxRetries: 3
      });
  } catch (err) {
    log.error('Failed to store files in Web3.Storage');
  }
}

const getFiles = async (cid) => {
  try {
    const res = await Web3Client.get(cid);
    const files = await res.files();

    for (const file of files) {
      log.info(`${file.cid} ${file.name} ${file.size}`);
    }
    return files;
  } catch (err) {
    log.error('Failed to get files in Web3.Storage: ', err);
  }
}

module.exports = {
  fileInputDetails,
  rootCid,
  getFiles
}
