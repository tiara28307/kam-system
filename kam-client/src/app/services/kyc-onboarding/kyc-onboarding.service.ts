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
      DoNotHavePermissionToServiceAlert('kyc onboarding').fire({});
    }
    return isAuth;
  }

  getPepTypes() {
      return this.httpreq.get("http://localhost:8082/kyc/onboarding/peptypes", {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'json'
      });
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

  updateDocument(body) {
    let isValidUser = this.canAccess();
    let documentData = new FormData();

    documentData.append('kyc_type', body.kycType);
    documentData.append('file', body.file);

    if (isValidUser) {
      return this.httpreq.post(`http://localhost:8082/kyc/onboarding/update/application/${body.applicationId}/document/${body.documentType}`, documentData, {
      responseType: 'text'
      });
    }
  }

  submitApplication(applicationId) {
    let isValidUser = this.canAccess();

    if (isValidUser) {
      return this.httpreq.post(`http://localhost:8082/kyc/onboarding/submit/application/${applicationId}`, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'text'
      });
    }
  }

  getSubmittedApplicationDetails(customerId) {
    let isValidUser = this.canAccess();

    if (isValidUser) {
      return this.httpreq.get(`http://localhost:8082/kyc/onboarding/customer/${customerId}/submitted/applicationdetails`, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'json'
      });
    }
  }

  getSubmittedApplicationPoiFile(customerId) {
    let isValidUser = this.canAccess();

    if (isValidUser) {
      return this.httpreq.get(`http://localhost:8082/kyc/onboarding/customer/${customerId}/submitted/poifile`, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'json'
      });
    }
  }

  getSubmittedApplicationPoaFile(customerId) {
    let isValidUser = this.canAccess();

    if (isValidUser) {
      return this.httpreq.get(`http://localhost:8082/kyc/onboarding/customer/${customerId}/submitted/poafile`, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'json'
      });
    }
  }
}
