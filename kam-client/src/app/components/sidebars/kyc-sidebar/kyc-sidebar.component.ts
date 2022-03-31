import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  historyLink: string;
  applicationLink: string;
  requestLink: string;
  kycServices = [
    'KYC Onboarding',
    'KYC Screening',
  ];

  constructor(
    private userService: UserService,
    private router: Router
    ) { }

  ngOnInit(): void {
    this.user = this.userService.getUserData();
    this.url = this.router.url;
    this.currentService = this.userService.currentService;
    this.setLinks();
  }

  setLinks() {
    if (this.currentService === this.kycServices[0]) {
      this.dashboardLink = '/user/kyc/onboarding/dashboard';
      this.applicationLink = '/user/kyc/onboarding/application/:id';
      this.requestLink = '/user/kyc/onboarding/requests';
    } else if (this.currentService === this.kycServices[1]) {
      this.dashboardLink = '/user/kyc/screening/dashboard';
      this.historyLink = '/user/kyc/screening/history';
      this.requestLink = '/user/kyc/screening/requests';
    }
  }
}
