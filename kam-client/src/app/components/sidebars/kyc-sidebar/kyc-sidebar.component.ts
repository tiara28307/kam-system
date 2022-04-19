import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KycOnboardingService } from 'src/app/services/kyc-onboarding/kyc-onboarding.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-kyc-sidebar',
  templateUrl: './kyc-sidebar.component.html',
  styles: [
  ]
})
export class KycSidebarComponent implements OnInit {
  user: any[];
  url: string;
  currentService: string;
  dashboardLink: string;
  applicationLink: string;
  historyLink: string;
  kycSearchLink: string;
  requestLink: string;
  applicationId: string;
  kycServices = [
    'KYC Onboarding',
    'KYC Screening',
  ];

  constructor(
    private userService: UserService,
    private router: Router,
    private onboardingService: KycOnboardingService
    ) {
      this.user = this.userService.getUserData();
    }

  ngOnInit(): void {
    // Get current user data
    this.url = this.router.url;
    this.currentService = this.userService.currentService;
    this.setServices();
  }

  // Set route paths for user based on current service enabled
  setServices() {
    if (this.currentService === this.kycServices[0]) {
      this.dashboardLink = '/user/kyc/onboarding/dashboard';
      this.applicationLink = '/user/kyc/onboarding/application';
      this.requestLink = '/user/kyc/onboarding/requests';
      this.getApplication();
    } else if (this.currentService === this.kycServices[1]) {
      this.dashboardLink = '/user/kyc/screening/dashboard';
      this.historyLink = '/user/kyc/screening/history';
      this.requestLink = '/user/kyc/screening/requests';
      this.kycSearchLink = '/user/kyc/screening/search';
    }
  }

  getApplication() {
    let customerId = 'C' + this.user[0].username.slice(-12); 

    this.onboardingService?.getApplication(customerId)?.subscribe(
      res => {
        this.setApplicationLink([res]);
      },
      error => {
        console.error('Error getting application data for customer: ', error);
      }
    );
  }

  setApplicationLink(application) {
    this.applicationId = application[0]?.applicationDetails?.application_id;
  }
}
