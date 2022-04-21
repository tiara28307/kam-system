const fs = require('fs');
const FormData = require('form-data');
const axios = require('axios');

const butlerApiBaseUrl = process.env.BUTLER_BASE_URL;
const butlerApiKey = process.env.BUTLER_API_KEY;
const idCardQueueId = process.env.BUTLER_IDCARD_QUEUE_ID;
const bankStatementQueueId = process.env.BUTLER_BANK_STATEMENT_QUEUE_ID;
const authHeaders = {
  'Authorization': 'Bearer ' + butlerApiKey
};

const idCardUploadUrl = butlerApiBaseUrl + '/queues/' + idCardQueueId + '/uploads';
const bankStatementUploadUrl = butlerApiBaseUrl + '/queues/' + bankStatementQueueId + '/uploads';
// const utilityBillUploadUrl
// const leaseSaleAgreementUploadUrl


// Uploads files to Butler OCR API and returns the id for fetching results
const uploadPoiFiles = async (filePaths) => {
  const formData = new FormData();
  filePaths.forEach(filePath => {
    formData.append('files', fs.createReadStream(filePath));
  });

  // upload file to Butler API
  console.log('Uploading proof of identity file to Butler for processing');
  const uploadResponse = await axios.post(
    idCardUploadUrl, 
    formData,
    {
      headers: { ...authHeaders, ...formData.getHeaders() }
    })
    .catch(error => {
      console.error(`Error uploading poi file to Butler API: ${error}`);
      return res.status(400).send({
        messageCode: 'BUTPOIERR',
        message: 'Failed to upload poi file to Butler API'
      });
    })

  return uploadResponse.data.uploadId;
}

// Uploads files to Butler OCR API and returns the id for fetching results
const uploadPoaFiles = async (filePaths, docObj) => {
  var uploadUrl;
  const formData = new FormData();
  filePaths.forEach(filePath => {
    formData.append('files', fs.createReadStream(filePath));
  });

  if (docObj.documentType === 'BS') {
    uploadUrl = bankStatementUploadUrl
  } else if (docObj.documentType === 'UB') {
    // uploadUrl = utilityBillUploadURL
  } else if (docObj.documentType == 'LA') {
    // uploadUrl = leaseAgreementUploadURL
  }

  console.log('Uploading proof of address file to Butler for processing');
  const uploadResponse = await axios.post(
    uploadUrl, 
    formData,
    {
      headers: { ...authHeaders, ...formData.getHeaders() }
    })
    .catch(error => {
      console.error(`Error uploading poa file to Butler API: ${error}`);
      return res.status(400).send({
        messageCode: 'BUTPOAERR',
        message: 'Failed to upload poa file to Butler API'
      });
    })

  return uploadResponse.data.uploadId;
}

const getExtractedPoiResults = async (uploadId) => {
  const extractionResultsUrl = butlerApiBaseUrl + '/queues/' + idCardQueueId + '/extraction_results';
  const params = { uploadId };
  const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));
  var extractionResults = null;

  while (!extractionResults) {
    console.log('Fetching extraction results');
    const resultApiResponse = await axios.get(
      extractionResultsUrl,
      { 
        headers: { ...authHeaders }, params 
      });

    const document = resultApiResponse.data.items[0];
    const extractionStatus = document.documentStatus;

    if (extractionStatus !== 'Completed') {
      console.log('Extraction still in progress. Sleeping for 5 seconds...');
      await sleep(5 * 1000);
    } else {
      console.log('Extraction results completed');
      return resultApiResponse.data;
    }

  }
}

const getExtractedPoaResults = async (uploadId, docObj) => {
  // const extractionResultsUrl = butlerApiBaseUrl + '/queues/' + bankStatementQueueId + '/extraction_results';
  var queueId;
  const params = { uploadId };
  const sleep = (waitTimeInMs) => new Promise(resolve => setTimeout(resolve, waitTimeInMs));
  var extractionResults = null;

  if (docObj.documentType === 'BS') {
    queueId = bankStatementQueueId
  } else if (docObj.documentType === 'UB') {
    // queueId = utilityBillUploadURL
  } else if (docObj.documentType == 'LA') {
    // queueId = leaseAgreementUploadURL
  }

  const extractionResultsUrl = butlerApiBaseUrl + '/queues/' + queueId + '/extraction_results';

  while (!extractionResults) {
    console.log('Fetching extraction results');
    const resultApiResponse = await axios.get(
      extractionResultsUrl,
      { 
        headers: { ...authHeaders }, params 
      });

    const document = resultApiResponse.data.items[0];
    const extractionStatus = document.documentStatus;

    if (extractionStatus !== 'Completed') {
      console.log('Extraction still in progress. Sleeping for 5 seconds...');
      await sleep(5 * 1000);
    } else {
      console.log('Extraction results completed');
      return resultApiResponse.data;
    }

  }
}

const butlerOcrExtraction = async (filePaths, docObj) => {
  const uploadId = docObj.kycType === 'poi' ? await uploadPoiFiles(filePaths) : await uploadPoaFiles(filePaths, docObj);
  const extractionResults = docObj.kycType === 'poi' ? await getExtractedPoiResults(uploadId) : await getExtractedPoaResults(uploadId, docObj);
  
  extractionResults.items.forEach(documentResult => {
    const fileName = documentResult.fileName;
    console.log('Extraction results from ' + fileName);
    
    console.log('Fields');
    documentResult.formFields.forEach(field => {
      const fieldName = field.fieldName;
      const value = field.value;
      console.log(fieldName + ': ' + value);
    });

    console.log('\n\nTables');
    documentResult.tables.forEach(table => {
      console.log('Table name: ' + table.tableName);
      table.row.forEach((row, index) => {
        var rowResults = 'Row ' + index + ': \n';
        row.cells.forEach(cell => {
          rowResults += cell.columnName + ': ' + cell.value + '\n';
        });
        console.log(rowResults);
      });
    });
  });
}

module.exports = {
  butlerOcrExtraction
}