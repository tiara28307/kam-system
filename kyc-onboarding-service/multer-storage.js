const multer  = require('multer');
const fs = require('fs');

function generateDocumentId() {
  let uuid = Math.floor(new Date().valueOf() * Math.random());
  let docId = 'D' + uuid.toString().slice(-8);
  return docId;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const applicationId = req.params.applicationId;
    const path = `./uploads/application/documents/${applicationId}/`;
    const pathExists = fs.existsSync(path);
    if (!pathExists) {
      fs.mkdirSync(path, { recursive: true });
    }
    cb(null, path);
  },
  filename: (req, file, cb) => {
    const kycType = req.body.kyc_type;
    const docId = generateDocumentId();
    const fName = `${docId}_${kycType}`;
    const filetype = file.mimetype.split('/')[1];
    cb(null, fName + '.' + filetype);
  }
});

const upload = multer({storage: storage});

module.exports = {
  upload
}
