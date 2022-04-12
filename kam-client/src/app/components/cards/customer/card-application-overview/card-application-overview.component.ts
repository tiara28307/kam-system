import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { KycOnboardingService } from "src/app/services/kyc-onboarding/kyc-onboarding.service";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-card-application-overview",
  templateUrl: "./card-application-overview.component.html",
})
export class CardApplicationOverviewComponent implements OnInit {
  isLoading = false;
  user: any[];
  applicationId = '';
  hasApplication: boolean;

  stepStatusComplete = {
    personalDetails: false,
    idProof: false,
    addressDetails: false,
    proofOfAddress: false,
    contact: false,
    declaration: false
  };

  constructor(
    private router: Router,
    private userService: UserService,
    private onboardingService: KycOnboardingService
  ) {}

  ngOnInit(): void {
    this.user = this.userService.getUserData();
    this.getApplication();
    this.userHasApplication();
  }

  getApplication() {
    this.isLoading = true;
    let customerId = 'C' + this.user[0].username.slice(-12); 

    this.onboardingService.getApplication(customerId).subscribe(
      res => {
        this.isLoading = false;
        this.setApplicationStatus([res]);
      },
      error => {
        this.isLoading = false;
        console.error('Error getting application data for customer: ', error);
      }
    );
  }

  // Check if customer has application
  userHasApplication() {
    let customerId = 'C' + this.user[0].username.slice(-12); 

    this.onboardingService.getApplicationExist(customerId).subscribe(
      res => {
        this.setHasApplication([res]);
      },
      error => {
        console.error('Error getting application data for customer: ', error);
      }
    );
  }

  setHasApplication(res) {
    this.hasApplication = res[0].exists
  }

  setApplicationStatus(application) {
    let applicationDetails = application[0].applicationDetails;
    this.applicationId = applicationDetails.application_id;

    let personalDetails = {
      firstName: applicationDetails.details[0].first_name,
      lastName: applicationDetails.details[0].last_name,
      fatherName: applicationDetails.details[0].father_name,
      motherName: applicationDetails.details[0].mother_name,
      maritalStatus: applicationDetails.details[0].marital_status,
      gender: applicationDetails.details[0].gender,
      dob: applicationDetails.details[0].dob,
      citizenshipStatus: applicationDetails.details[0].citizenship_status,
      occupation: applicationDetails.details[0].occupation,
      isPep: applicationDetails.details[0].pep,
      isRcaPep: applicationDetails.details[0].rca_pep,
      pepExposure: applicationDetails.details[0].pep_exposure
    }

    let poiDetails = {
      poiType: applicationDetails.details[0].poi_type,
      poiFile: applicationDetails.details[0].poi_file
    }

    let addressDetails = {
      currentAddress: applicationDetails.details[0].current_address,
      permanentAddress: applicationDetails.details[0].permanent_address
    }

    let poaDetails = {
      poaType: applicationDetails.details[0].poa_type,
      poaFile: applicationDetails.details[0].poa_file
    }

    let contactDetails = {
      email: applicationDetails.details[0].email,
      phone: applicationDetails.details[0].phone
    }

    let isDeclared = applicationDetails.details[0].declared;

    const personalIncomplete = Object.values(personalDetails).some(val => val === null || val === '');
    const poiIncomplete = Object.values(poiDetails).some(val => val === null || val === '');
    const currentAddressIncomplete = Object.values(addressDetails.currentAddress).some(val => val === null || val === '');
    const permanentAddressIncomplete = Object.values(addressDetails.permanentAddress).some(val => val === null || val === '');
    const poaDetailsIncomplete = Object.values(poaDetails).some(val => val === null || val === '');
    const contactDetailsIncomplete = Object.values(contactDetails).some(val => val === null || val === '');
    const declarationComplete = isDeclared;

    this.stepStatusComplete.personalDetails = !personalIncomplete;
    this.stepStatusComplete.idProof = !poiIncomplete;
    this.stepStatusComplete.addressDetails = !(currentAddressIncomplete && permanentAddressIncomplete);
    this.stepStatusComplete.proofOfAddress = !poaDetailsIncomplete;
    this.stepStatusComplete.contact = !contactDetailsIncomplete;
    this.stepStatusComplete.declaration = declarationComplete;
  }

  getStatusColor(status) {
    return status ? 'text-emerald-600' : 'text-red-600';
  }

  getStatusIcon(status) {
    return status ? 'fa-circle-check' : 'fa-circle-xmark';
  }

  openApplication(id: string) {
    this.router.navigate(['/user/kyc/onboarding/application', id]);
  }
}
