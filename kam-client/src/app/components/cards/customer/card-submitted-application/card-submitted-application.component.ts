import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { KycOnboardingService } from 'src/app/services/kyc-onboarding/kyc-onboarding.service';
import { UserService } from 'src/app/services/user.service';
import { Web3StorageService } from 'src/app/services/web3-storage.service';

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
    this.getCredentials();
  }

  getCredentials() {
    this.isLoading = true;
    let customerId = 'C' + this.user[0].username.slice(-12); 

    this.onboardingService.getSubmittedApplicationCredentials(customerId).subscribe(
      res => {
        this.isLoading = false;
        this.getFiles([res])
      },
      error => {
        this.isLoading = false;
        console.error('Error getting application data for customer: ', error);
      }
    );
  }

  getFiles(res) {
    this.onboardingService.getSubmittedApplicationDetails().subscribe(
      res => {
        console.log('Application Details: ', res);
      },
      error => {
        console.error('Error getting application details from blockchain: ', error);
      }
    )
    /*let credentials = res[0].credentials;
    let files = this.web3Storage.retrieveFiles(credentials[1]);
    console.log(files);*/
  }

  /*getAppDetails(res) {
    let credentials = res[0].credentials;
    this.getSubmittedApplicationDetails(credentials)
    this.getSubmittedApplicationPoiFile(credentials)
    this.getSubmittedApplicationPoaFile(credentials)
  }

  getSubmittedApplicationDetails(credentials) {
    this.isLoading = true;

    let appObj = {
      cid: credentials[1],
      applicationId: credentials[0]
    }

    this.onboardingService.getSubmittedApplicationDetails(appObj).subscribe(
      res => {
        this.isLoading = false;
        this.applicationData = [res];
        console.log('Application Details: ', [res]);
      },
      error => {
        this.isLoading = false;
        console.error('Error getting application details from blockchain: ', error);
      }
    );
  }

  getSubmittedApplicationPoiFile(credentials) {
    this.isLoading = true;

    let appObj = {
      cid: credentials[1],
      applicationId: credentials[0],
      filename: credentials[2]
    }

    this.onboardingService.getSubmittedApplicationPoiFile(appObj).subscribe(
      res => {
        this.isLoading = false;
        this.poiFileLink = res as string;
        console.log('poifile: ', res);
      },
      error => {
        this.isLoading = false;
        console.error('Error getting application poi file from blockchain: ', error);
      }
    );
  }

  getSubmittedApplicationPoaFile(credentials) {
    this.isLoading = true;

    let appObj = {
      cid: credentials[1],
      applicationId:credentials[0],
      filename: credentials[3]
    }

    this.onboardingService.getSubmittedApplicationPoaFile(appObj).subscribe(
      res => {
        this.isLoading = false;
        this.poaFileLink = res as string;
        console.log('poafile: ', res);
      },
      error => {
        this.isLoading = false;
        console.error('Error getting application poa file from blockchain: ', error);
      }
    );
  }*/

}
