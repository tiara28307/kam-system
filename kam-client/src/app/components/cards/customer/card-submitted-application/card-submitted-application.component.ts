import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KycOnboardingService } from 'src/app/services/kyc-onboarding/kyc-onboarding.service';
import { UserService } from 'src/app/services/user.service';
import { Web3StorageService } from 'src/app/services/web3-storage.service';
import { ApplicationDeletedAlert, DeleteSubmittedApplicationAlert, FailedDeleteApplicationAlert } from 'src/constants/alerts.constant';

@Component({
  selector: 'app-card-submitted-application',
  templateUrl: './card-submitted-application.component.html',
  styles: [
  ]
})
export class CardSubmittedApplicationComponent implements OnInit {
  isLoading = false;
  user: any[];
  applicationData: any[];
  applicationId: string;
  poiFileLink = '';
  poaFileLink = '';

  constructor(
    private onboardingService: KycOnboardingService,
    private userService: UserService,
    private router: Router,
    private web3Storage: Web3StorageService
  ) { }

  ngOnInit(): void {
    this.user = this.userService.getUserData();
    this.getSubmittedApplicationDetails();
    this.getSubmittedApplicationPoiFile();
    this.getSubmittedApplicationPoaFile();
  }

  getSubmittedApplicationDetails() {
    this.isLoading = true;
    let customerId = 'C' + this.user[0].username.slice(-12); 

    this.onboardingService.getSubmittedApplicationDetails(customerId).subscribe(
      res => {
        this.isLoading = false;
        this.setApplicationDetails([res]);
      },
      error => {
        this.isLoading = false;
        console.error('Error getting application details from blockchain: ', error);
      }
    );
  }

  setApplicationDetails(res) {
    this.applicationData = res[0].data;
    this.applicationId = res[0].data.application_id;
  }

  setPoiLink(res) {
    this.poiFileLink = res[0].poiLink;
  }

  setPoaLink(res) {
    this.poaFileLink = res[0].poaLink;
  }

  getSubmittedApplicationPoiFile() {
    this.isLoading = true;
    let customerId = 'C' + this.user[0].username.slice(-12); 

    this.onboardingService.getSubmittedApplicationPoiFile(customerId).subscribe(
      res => {
        this.isLoading = false;
        console.log(res);
        this.setPoiLink([res]);
      },
      error => {
        this.isLoading = false;
        console.error('Error getting application poi file from blockchain: ', error);
      }
    );
  }

  getSubmittedApplicationPoaFile() {
    this.isLoading = true;
    let customerId = 'C' + this.user[0].username.slice(-12); 

    this.onboardingService.getSubmittedApplicationPoaFile(customerId).subscribe(
      res => {
        this.isLoading = false;
        console.log(res);
        this.setPoaLink([res]);
      },
      error => {
        this.isLoading = false;
        console.error('Error getting application poa file from blockchain: ', error);
      }
    );
  }

  deleteApplication() {
    this.isLoading = true;

    this.onboardingService.deleteApplication(this.applicationId).subscribe(
      res => {
        this.isLoading = false;
        ApplicationDeletedAlert.fire({})
          .then(() => {
            this.router.navigate(['/user/kyc/onboarding/dashboard']);
          });
        console.log('response: ', res);
      },
      error => {
        this.isLoading = false;
        FailedDeleteApplicationAlert(error).fire({});
      }
    );
  }

  onDelete() {
    DeleteSubmittedApplicationAlert.fire({})
      .then((result) => {
        if (result.isConfirmed === true) {
          this.deleteApplication();
        }
      });
  }

}
