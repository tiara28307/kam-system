import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DoNotHavePermissionToServiceAlert } from 'src/constants/alerts.constant';
import { AuthService } from '../auth.service';

@Injectable({
  providedIn: 'root'
})
export class KycOnboardingService {

  constructor(
    private httpreq: HttpClient,
    private authService: AuthService
  ) { }

  // Check authentication again before accessing backend services for KOS
  canAccess(): boolean {
    let isAuth = this.authService.isAuthenticated('CUSTOMER');
    
    if(!isAuth) {
      DoNotHavePermissionToServiceAlert.fire({});
    }
    return isAuth;
  }

  getPepTypes() {
    let isValidUser = this.canAccess();

    if (isValidUser) {
      return this.httpreq.get("http://localhost:8082/kyc/onboarding/peptypes", {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'json'
      });
    }
  }

  createNewApplication(body) {
    let isValidUser = this.canAccess();

    if (isValidUser) {
      return this.httpreq.post("http://localhost:8082/kyc/onboarding/create/application", body, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'text'
      });
    }
  }

  getApplication(customerId) {
    let isValidUser = this.canAccess();

    if (isValidUser) {
      return this.httpreq.get(`http://localhost:8082/kyc/onboarding/customer/${customerId}/application`, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'json'
      }); 
    }
  }

  updateApplicationDetails(body) {
    let isValidUser = this.canAccess();

    if (isValidUser) {
      return this.httpreq.post(`http://localhost:8082/kyc/onboarding/update/applicationdetails`, body, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'text'
      });
    }
  }

  getApplicationExist(customerId) {
    let isValidUser = this.canAccess();

    if (isValidUser) {
      return this.httpreq.get(`http://localhost:8082/kyc/onboarding/customer/${customerId}/application/exist`, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'json'
      });
    }
  }

  deleteApplication(applicationId) {
    let isValidUser = this.canAccess();

    if (isValidUser) {
      return this.httpreq.post(`http://localhost:8082/kyc/onboarding/delete/application/${applicationId}`, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'text'
      });
    }
  }
}
