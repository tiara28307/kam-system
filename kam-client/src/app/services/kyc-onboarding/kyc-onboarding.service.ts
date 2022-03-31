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
      return this.httpreq.get("http://localhost:8080/kyc/onboarding/peptypes", {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'json'
      });
    }
  }
}
