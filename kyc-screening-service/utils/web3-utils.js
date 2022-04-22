
const { Web3Storage } = require('web3.storage');

const decisionCID = {
  cid: '',
  getCID() {
    return this.cid;
  },
  setCID(_cid) {
    this.cid = _cid
  }
}

module.exports = {
  decisionCID
}
