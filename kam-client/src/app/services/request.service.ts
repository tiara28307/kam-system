import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DoNotHavePermissionToServiceAlert } from 'src/constants/alerts.constant';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private _req = [];

  constructor(
    private httpreq: HttpClient,
    private authService: AuthService
  ) { }

  set req(data) {
    this._req = data;
  }

  get req() {
    return this._req;
  }

  canAccess(): boolean {
    let isAuthCustomer = this.authService.isAuthenticated('CUSTOMER');
    let isAuthCompany = this.authService.isAuthenticated('COMPANY');
    
    if (!isAuthCustomer && !isAuthCompany) {
      DoNotHavePermissionToServiceAlert('request').fire({});
    }

    return isAuthCustomer || isAuthCompany;
  }

  createNewRequest(body) {
    let isValidUser = this.canAccess();

    if (isValidUser) {
      return this.httpreq.post("http://localhost:8083/kyc/request/new", body, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'text'
      });
    }
  }

  getRequests(userType, email) {
    let isValidUser = this.canAccess();

    if (isValidUser) {
      return this.httpreq.get(`http://localhost:8083/kyc/request/all/user/${userType}/${email}`, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'json'
      }); 
    }
  }

  updateRequest(body) {
    let isValidUser = this.canAccess();

    if (isValidUser) {
      return this.httpreq.post(`http://localhost:8083/kyc/request/update`, body, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'text'
      });
    }
  }
}
