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
  applicationObj = [];

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
    this.request = this.requestService.currentReq.getReq();
    this.checkStatus();
    if (this.currentService === 'KYC Onboarding') {
      this.getApplication();
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

  getApplication() {
    this.isLoading = true;
    let customerId = 'C' + this.user[0].username.slice(-12); 

    this.onboardingService.getApplication(customerId).subscribe(
      res => {
        this.isLoading = false;
        this.setApplicationObj([res]);
      },
      error => {
        this.isLoading = false;
        console.error('Error getting application data for customer: ', error);
      }
    );
  }

  setApplicationObj(res) {
    this.applicationObj = res;
  }

  onDecision(status) {
    this.isLoading;
    let reqObj;
    let appDetails = this.applicationObj[0].applicationDetails
    let cids = appDetails.application_cids;
    let currentCid = cids[cids.length - 1];

    if (status === 'ACCEPTED') {
      reqObj = {
        requestId: this.request.request_id,
        status: status,
        applicationId: appDetails.application_id,
        cid: currentCid,
        poiFilename: appDetails.documents[0].poi.file_name,
        poaFilename: appDetails.documents[0].poa.file_name
      }
    } else if (status === 'REJECTED') {
      reqObj = {
        requestId: this.request.request_id,
        status: status,
        applicationId: '',
        cid: '',
        poiFilename: '',
        poaFilename: ''
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
