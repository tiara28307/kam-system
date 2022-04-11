import { Component, OnInit } from '@angular/core';
import { CognitoUserAttribute, CognitoUserPool } from 'amazon-cognito-identity-js';
import { KycOnboardingService } from 'src/app/services/kyc-onboarding/kyc-onboarding.service';
import { UserService } from 'src/app/services/user.service';
import { FailedCreateApplicationAlert } from 'src/constants/alerts.constant';
import { environment } from "src/environments/environment";

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styles: [
  ]
})
export class ApplicationComponent implements OnInit {
  isLoading = false;
  applicationType: String;
  applicationCreated = true;
  user: any[];
  isIndividual = false;
  isBusiness = false;

  constructor(
    private userService: UserService,
    private onboardingService: KycOnboardingService
  ) { }

  ngOnInit(): void {
    // Get user data to create application
    this.user = this.userService.getUserData();
    this.applicationType = 'INDIVIDUAL';
  }

  toggleIsIndividual(event) {
    event.preventDefault();
    if (this.isIndividual === false) {
      this.isIndividual = !this.isIndividual
    }
    this.isBusiness = false;
    console.log('Individual Application');
  }

  toggleIsBusiness(event) {
    event.preventDefault();
    if (this.isBusiness === false) {
      this.isBusiness = !this.isBusiness;
    }
    this.isIndividual = false;
    console.log('Business Application');
  }

  // Check if customer already has application created
  userHasApplication() {
    let hasApplication = this.user[0].hasApplication;
    this.applicationCreated = hasApplication === 1 ? true : false;
  }

  // Update user has application attribute
  updateUserApplicationStatus() {
    let poolData = {
      UserPoolId: environment.AWS_COGNITO_USER_POOL,
      ClientId: environment.AWS_COGNITO_CLIENT_ID
    };
    let userPool = new CognitoUserPool(poolData);
    let cognitoUser = userPool.getCurrentUser();

    const hasApplication = new CognitoUserAttribute({
      Name: "custom:hasApp",
      Value: '1'
    });

    cognitoUser.updateAttributes([hasApplication], (err, result) => {
      if (err) {
        console.error('Update has application error: ', err);
      }
      console.log('Update has application successful: ', result);
    })
  }

  // Create new application on start application
  onStartNewApplication() {
    this.isLoading = true;
    var applicationType: string;

    let customerId = 'C' + this.user[0].username.slice(-12);

    if (this.isBusiness) {
      applicationType = 'BUSINESS';
    } else if (this.isIndividual) {
      applicationType = 'INDIVIDUAL';
    }

    let newApplication = {
      customerId: customerId,
      type: applicationType
    }

    this.onboardingService.createNewApplication(newApplication).subscribe(
      res => {
        this.isLoading = false;
        this.applicationCreated = true;
        this.updateUserApplicationStatus();
        this.setApplicationType(applicationType);
        console.log('response: ', res);
      },
      error => {
        this.isLoading = false;
        FailedCreateApplicationAlert(error).fire({});
      }
    );
  }

  setApplicationType(type) {
    this.applicationType = type;
  }

}
