import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private _requestId: string;
  private _status: string;

  constructor() { }

  set requestId(id: string) {
    this._requestId = id;
  }

  get requestId(): string {
    return this._requestId;
  }

  set status(status: string) {
    this._status = status;
  }

  get status(): string {
    return this._status;
  }

  acceptedRequest() {
    console.log('accepted request: ', this._requestId);
  }

  rejectedRequest() {
    console.log('rejected request: ', this._requestId);
  }
}
