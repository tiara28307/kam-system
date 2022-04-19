import { Injectable } from '@angular/core';
import { Web3Storage } from 'web3.storage';
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class Web3StorageService {

  constructor() { }

  getAccessToken() {
    return environment.WEB3_STORAGE_TOKEN;
  }

  makeStorageClient() {
    return new Web3Storage({ token: this.getAccessToken() });
  }

  checkStatus = async (cid) => {
    const client = this.makeStorageClient();
    const status = await client.status(cid);
    return status;
  }

  retrieveFiles = async (cid) => {
    const client = this.makeStorageClient()
    const res = await client.get(cid)
    console.log(`[${res.status}] Get Application from Web3 Storage successful`)

    const files = await res.files();
    for (const file of files) {
      console.log(JSON.stringify(file));
    }
  }

}
