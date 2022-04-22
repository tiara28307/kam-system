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
    let isAuth = this.authService.isAuthenticated('COMPANY');
    
    if(!isAuth) {
      DoNotHavePermissionToServiceAlert('kyc screening').fire({});
    }
    return isAuth;
  }

  // sendRequest()
  // getRequest()

  createNewApplication(body) {
    let isValidUser = this.canAccess();

    if (isValidUser) {
      return this.httpreq.post("http://localhost:8084/kyc/screening/create/application", body, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'text'
      });
    }
  }

  getApplication(companyId) {
    let isValidUser = this.canAccess();

    if (isValidUser) {
      return this.httpreq.get(`http://localhost:8084/kyc/screening/company/${companyId}/application`, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'json'
      });
    }
  }

  getIncorporationCountries() {
    let isValidUser = this.canAccess();

    if (isValidUser) {
      return this.httpreq.get("http://localhost:8084/kyc/screening/countries/incorporation", {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'json'
      });
    }
  }

  getGovernmentCountries() {
    let isValidUser = this.canAccess();

    if (isValidUser) {
      return this.httpreq.get("http://localhost:8084/kyc/screening/countries/government", {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'json'
      });
    }
  }

  getNationalityCountries() {
    let isValidUser = this.canAccess();

    if (isValidUser) {
      return this.httpreq.get("http://localhost:8084/kyc/screening/countries/nationality", {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'json'
      });
    }
  }

  getOperationCountries() {
    let isValidUser = this.canAccess();

    if (isValidUser) {
      return this.httpreq.get("http://localhost:8084/kyc/screening/countries/operation", {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'json'
      });
    }
  }

  getResidenceCountries() {
    let isValidUser = this.canAccess();

    if (isValidUser) {
      return this.httpreq.get("http://localhost:8084/kyc/screening/countries/residence", {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'json'
      });
    }
  }

  getLegalStructures() {
    let isValidUser = this.canAccess();

    if (isValidUser) {
      return this.httpreq.get("http://localhost:8084/kyc/screening//legalstructures", {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'json'
      });
    }
  }

  getIndividualSanctions(firstName, lastName) {
    let isValidUser = this.canAccess();

    if (isValidUser) {
      return this.httpreq.get(`http://localhost:8084/kyc/screening/individual/sanctions/${firstName}/${lastName}`, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'json'
      });
    }
  }

  getBusinessSanctions(companyName) {
    let isValidUser = this.canAccess();

    if (isValidUser) {
      return this.httpreq.get(`http://localhost:8084/kyc/screening/business/sanctions/${companyName}`, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'json'
      });
    }
  }

  extractPoiInformation(body) {
    let isValidUser = this.canAccess();

    if (isValidUser) {
      return this.httpreq.post("http://localhost:8084/kyc/screening/application/extraction/poi", body, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'json'
      });
    }
  }

  extractPoaInformation(body) {
    let isValidUser = this.canAccess();

    if (isValidUser) {
      return this.httpreq.post("http://localhost:8084/kyc/screening/application/extraction/poa", body, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'json'
      });
    }
  }

  updatePoiExtraction(body) {
    let isValidUser = this.canAccess();

    if (isValidUser) {
      return this.httpreq.post("http://localhost:8084/kyc/screening/update/application/poiextraction", body, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'text'
      });
    }
  }

  updatePoaExtraction(body) {
    let isValidUser = this.canAccess();

    if (isValidUser) {
      return this.httpreq.post("http://localhost:8084/kyc/screening/update/application/poaextraction", body, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'text'
      });
    }
  }

  updateDecisionComments(body) {
    let isValidUser = this.canAccess();

    if (isValidUser) {
      return this.httpreq.post("http://localhost:8084/kyc/screening/update/application/decisionandcomments", body, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'text'
      });
    }
  }

  updateRiskScore(body) {
    let isValidUser = this.canAccess();

    if (isValidUser) {
      return this.httpreq.post("http://localhost:8084/kyc/screening/update/application/riskscore", body, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'text'
      });
    }
  }

  shareApplicationDecision(applicationId) {
    let isValidUser = this.canAccess();

    if (isValidUser) {
      return this.httpreq.post(`http://localhost:8084/kyc/screening/share/application/${applicationId}/decision`, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'text'
      });
    }
  }

  getSubmittedApplicationDetails(appObj) {
    let isValidUser = this.canAccess();

    if (isValidUser) {
      return this.httpreq.get(`http://localhost:8084/kyc/screening/company/${appObj.applicationId}/${appObj.cid}/submitted/applicationdetails`, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'json'
      });
    }
  }

  getSubmittedApplicationPoiFile(appObj) {
    let isValidUser = this.canAccess();

    if (isValidUser) {
      return this.httpreq.get(`http://localhost:8084/kyc/screening/company/${appObj.applicationId}/${appObj.cid}/${appObj.poifile}/submitted/poifile`, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'json'
      });
    }
  }

  getSubmittedApplicationPoaFile(appObj) {
    let isValidUser = this.canAccess();

    if (isValidUser) {
      return this.httpreq.get(`http://localhost:8084/kyc/screening/company/${appObj.applicationId}/${appObj.cid}/${appObj.poafile}/submitted/poafile`, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'json'
      });
    }
  }
}
