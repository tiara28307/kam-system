import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DialogRef } from '@ngneat/dialog';
import { KycOnboardingService } from 'src/app/services/kyc-onboarding/kyc-onboarding.service';
import { RequestService } from 'src/app/services/request.service';
import { UserService } from 'src/app/services/user.service';
import { FailedRequestDecisionAlert, RequestDecisionAlert } from 'src/constants/alerts.constant';

@Component({
  selector: 'app-card-request-overview',
  templateUrl: './card-request-overview.component.html',
  styles: [
  ]
})
export class CardRequestOverviewComponent implements OnInit {
  request: any;
  status: string;
  isDecided = false;
  isAccepted = false;
  currentService: String;
  isLoading = false;
  user: any[];
  applicationIds = [];

  constructor(
    public ref: DialogRef,
    private requestService: RequestService,
    private userService: UserService,
    private router: Router,
    private onboardingService: KycOnboardingService
  ) { }

  ngOnInit(): void {
    this.user = this.userService.getUserData();
    this.currentService = this.userService.currentService;
    this.request = this.requestService.req;
    this.checkStatus();
    if (this.currentService === 'KYC Onboarding') {
      this.getApplicationIdCid();
    }
  }

  getStatusColor(status) {
    switch (status) {
      case 'ACCEPTED':
        return 'text-emerald-500';
      case 'REJECTED':
        return 'text-red-600';
      case 'PENDING':
        return 'text-sky-600'
    }
  }

  checkStatus() {
    this.isDecided = (this.request.status === 'ACCEPTED' || this.request.status === 'REJECTED');
    this.isAccepted = this.request.status === 'ACCEPTED';
  }

  getApplicationIdCid() {
    this.isLoading = true;
    let customerId = 'C' + this.user[0].username.slice(-12); 

    this.onboardingService.getApplicationIdCid(customerId).subscribe(
      res => {
        this.isLoading = false;
        this.setApplicationIds([res]);
      },
      error => {
        this.isLoading = false;
        console.error('Error getting application data for customer: ', error);
      }
    );
  }

  setApplicationIds(res) {
    this.applicationIds = res;
  }

  onDecision(status) {
    this.isLoading;
    let reqObj;

    if (status === 'ACCEPTED') {
      reqObj = {
        requestId: this.request.request_id,
        status: status,
        applicationId: this.applicationIds[0].ids.applicationId,
        cid: this.applicationIds[0].ids.cid
      }
    } else if (status === 'REJECTED') {
      reqObj = {
        status: status,
        applicationId: '',
        cid: ''
      }
    }

    this.requestService.updateRequest(reqObj).subscribe(
      res => {
        this.isLoading = false;
        RequestDecisionAlert.fire({});
        console.log('response: ', res);
      },
      error => {
        this.isLoading = false;
        FailedRequestDecisionAlert(error).fire({});
      }
    );
    this.ref.close();
  }

  openApplication(applicationId) {
    this.router.navigate(['/user/kyc/screening/application', applicationId]);
    this.ref.close();
  }

}
