import { Component, OnInit } from '@angular/core';
import { KycOnboardingService } from 'src/app/services/kyc-onboarding/kyc-onboarding.service';
import { UserService } from 'src/app/services/user.service';
import { FailedCreateApplicationAlert } from 'src/constants/alerts.constant';

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styles: [
  ]
})
export class ApplicationComponent implements OnInit {
  isLoading = false;
  applicationType: String;
  user: any[];
  isIndividual = false;
  isBusiness = false;
  hasApplication = false;

  constructor(
    private userService: UserService,
    private onboardingService: KycOnboardingService
  ) { }

  ngOnInit(): void {
    // Get user data to create application
    this.user = this.userService.getUserData();
    this.userHasApplication();
    this.getApplicationType();
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
    this.isLoading = true;
    let customerId = 'C' + this.user[0].username.slice(-12); 

    this.onboardingService.getApplicationExist(customerId).subscribe(
      res => {
        this.isLoading = false;
        this.setHasApplication([res]);
      },
      error => {
        this.isLoading = false;
        console.error('Error getting application data for customer: ', error);
      }
    );
  }

  setHasApplication(res) {
    this.hasApplication = res[0].exists
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
        this.userHasApplication();
        this.getApplicationType();
        console.log('response: ', res);
      },
      error => {
        this.isLoading = false;
        FailedCreateApplicationAlert(error).fire({});
      }
    );
  }

  getApplicationType() {
    this.isLoading = true;
    let customerId = 'C' + this.user[0].username.slice(-12); 

    this.onboardingService.getApplication(customerId).subscribe(
      res => {
        this.isLoading = false;
        this.setApplicationType([res]);
      },
      error => {
        this.isLoading = false;
        console.error('Error getting application data for customer: ', error);
      }
    );
  }

  setApplicationType(res) {
    const isSubmitted = res[0].applicationDetails.submitted;
    var type: any;
    
    if (isSubmitted) {
      type = 'SUBMITTED';
    } else {
      type = res[0].applicationDetails.application_type;
    }

    this.applicationType = type;
  }

}
