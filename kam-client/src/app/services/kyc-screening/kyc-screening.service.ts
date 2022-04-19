import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DoNotHavePermissionToServiceAlert } from 'src/constants/alerts.constant';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class KycScreeningService {

  constructor(
    private httpreq: HttpClient,
    private authService: AuthService
  ) { }

  // Check authentication again before accessing backend services for KSS
  canAccess(): boolean {
    let isAuth = this.authService.isAuthenticated('CUSTOMER');
    
    if(!isAuth) {
      DoNotHavePermissionToServiceAlert('kyc screening').fire({});
    }
    return isAuth;
  }

  /* 
  sendRequest(body) {
    let isValidUser = this.canAccess();

    if (isValidUser) {
      return this.httpreq.post("http://localhost:8082/kyc/screening/request", body, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'text'
      });
    }
  }

  getRequests(body) {
    let isValidUser = this.canAccess();

    if (isValidUser) {
      return this.httpreq.get("http://localhost:8082/kyc/screening/requests", body, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'text'
      });
    }
  }

  screenApplication(body) {
    let isValidUser = this.canAccess();

    if (isValidUser) {
      return this.httpreq.post("http://localhost:8082/kyc/screening/:applicationId", body, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'json'
      });
    }
  }

  saveDecision(body) {
    let isValidUser = this.canAccess();

    if (isValidUser) {
      return this.httpreq.post("http://localhost:8082/kyc/screening/:applicationId/decision", body, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'json'
      });
    }
  }

  shareDecision(body) {
    let isValidUser = this.canAccess();

    if (isValidUser) {
      return this.httpreq.post("http://localhost:8082/kyc/screening/:applicationId/sharedecision", body, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'json'
      });
    }
  }

  getCompletedScreenings(body) {
    let isValidUser = this.canAccess();

    if (isValidUser) {
      return this.httpreq.get("http://localhost:8082/kyc/screening/applications", body, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'json'
      });
    }
  }
  */
}
