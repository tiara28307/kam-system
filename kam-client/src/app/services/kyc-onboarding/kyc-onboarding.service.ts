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

  getSubmittedApplicationCredentials(customerId) {
    let isValidUser = this.canAccess();

    if (isValidUser) {
      return this.httpreq.get(`http://localhost:8082/kyc/onboarding/customer/${customerId}/submitted/applicationcredentials`, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'json'
      });
    }
  }

  getSubmittedApplicationDetails() {
    let isValidUser = this.canAccess();

    if (isValidUser) {
      return this.httpreq.get(`https://gateway.ipfs.io/ipfs/bafybeicnub6avzilytjv2dbvoq2hshu4jl22rta3pwo37oiebu7qncms7i/K51663099/K51663099.json`, {
      headers: { 
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
        "Access-Control-Allow-Headers": "Access-Control-Allow-Headers,Origin,Accept,X-Requested-With,Content-Type,Access-Control-Request-Method,Access-Control-Request-Headers",
        'Content-Type': 'application/json', 
      },
      responseType: 'json'
      });
    }
  }

  getSubmittedApplicationPoiFile(body) {
    let isValidUser = this.canAccess();

    if (isValidUser) {
      return this.httpreq.get(`https://${body.cid}.ipfs.dweb.link/${body.applicationId}/${body.filename}`, {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'http://localhost:4200' },
      responseType: 'json'
      });
    }
  }

  getSubmittedApplicationPoaFile(body) {
    let isValidUser = this.canAccess();

    if (isValidUser) {
      return this.httpreq.get(`https://${body.cid}.ipfs.dweb.link/${body.applicationId}/${body.filename}`, {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'http://localhost:4200' },
      responseType: 'json'
      });
    }
  }
}
