import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicationValidationService } from 'src/app/services/kyc-onboarding/application-validation.service';
import { KycOnboardingService } from 'src/app/services/kyc-onboarding/kyc-onboarding.service';
import { RegisterService } from 'src/app/services/register.service';
import { ApplicationNotCompleteAlert } from 'src/constants/alerts.constant';

@Component({
  selector: 'app-card-individual-application',
  templateUrl: './card-individual-application.component.html',
  styles: [
  ]
})
/* 
  Component for Individual Customer Application Form
*/
export class CardIndividualApplicationComponent implements OnInit {
  isLoading = false;
  
  individualApplicationForm: FormGroup;
  applicationId: String;
  step: number;
  forwardButtonText = 'Next';
  proofOfIdentity: File;
  poiLabel = 'Select a photo';
  proofOfAddress: File;
  poaLabel = 'Select a document';
  
  pepTypes = [];
  countries = [];

  citizenshipTypes = [
    { code: 1, name: 'U.S. Citizen or U.S. National' },
    { code: 2, name: 'U.S. Dual Citizen' },
    { code: 3, name: 'U.S. Permanent Resident' },
    { code: 4, name: 'U.S. Refugee or Asylee' },
    { code: 5, name: 'Other (Non-U.S.)' }
  ];

  // Step progress states: NS - not started, IP - in progress, IC - incomplete, C - complete
  steps = [
    { step: 1, progress: 'NS' },
    { step: 2, progress: 'NS' },
    { step: 3, progress: 'NS' },
    { step: 4, progress: 'NS' },
    { step: 5, progress: 'NS' },
    { step: 6, progress: 'NS' },
  ];
  
  constructor(
    private formBuilder: FormBuilder,
    private applicationValidator: ApplicationValidationService,
    private onboardingService: KycOnboardingService,
    private registerService: RegisterService
  ) {}

  ngOnInit(): void {
    // Select field data in application
    this.setPepTypes();
    this.setCountries();

    // Initial application start at Step 1
    this.step = this.steps[0].step;
    this.steps[0].progress = 'IP';

    // TODO: set application id based on db
    this.applicationId = 'K00000001';

    // Build form for individual application with input validation scheme
    this.individualApplicationForm = this.formBuilder.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      maidenName: [''],
      fatherName: ['', [Validators.required]],
      motherName: ['', [Validators.required]],
      motherMaidenName: [''],
      spouseName: [''],
      maritalStatus: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      dob: ['', [Validators.required]],
      citizenshipStatus: ['', [Validators.required]],
      occupation: ['', [Validators.required]],
      isPEP: ['', [Validators.required]],
      isRcaPEP: ['', [Validators.required]],
      pepExposure: ['', [Validators.required]],
      poiType: ['', [Validators.required]], 
      poi: [this.proofOfIdentity, Validators.compose([
        Validators.required,
        Validators.pattern(this.applicationValidator.poiFilePattern)
      ])],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      postalCode: ['', Validators.compose([
        Validators.required,
        Validators.pattern(this.applicationValidator.postalCodePattern)
      ])],
      country: ['', [Validators.required]],
      isSameAddress: ['', [Validators.required]],
      permanentAddress: [''],
      permanentCity: [''],
      permanentState: [''],
      permanentPostalCode: ['', Validators.compose([
        Validators.pattern(this.applicationValidator.postalCodePattern)
      ])],
      permanentCountry: [''],
      poaType: ['', [Validators.required]],
      poa: [this.proofOfAddress, Validators.compose([
        Validators.required,
        Validators.pattern(this.applicationValidator.poaFilePattern)
      ])],
      phone: ['', Validators.compose([
        Validators.required,
        Validators.pattern(this.applicationValidator.phonePattern)
      ])],
      email: ['', Validators.compose([
        Validators.required,
        Validators.email
      ])],
      isDeclared: [false, [Validators.required]],
    },
    {
      validators: [
        this.applicationValidator.checkPermanentAddress,
        this.applicationValidator.checkPermanentCity,
        this.applicationValidator.checkPermanentState,
        this.applicationValidator.checkPermanentPostalCode,
        this.applicationValidator.checkPermanentCountry
      ]
    }
    );
  }

  // Set format for date of birth field on change
  onDateKey(event: KeyboardEvent) {
    let dobVal = this.individualApplicationForm.controls['dob'].value;

    dobVal = dobVal.replace(/^(\d\d)(\d)$/g,'$1/$2').replace(/^(\d\d\/\d\d)(\d+)$/g,'$1/$2').replace(/[^\d\/]/g,'');
    this.individualApplicationForm.controls['dob'].setValue(dobVal);
  }

  // Set politically exposed person types
  setPepTypes() {
    this.onboardingService.getPepTypes().subscribe(
      res => {
        this.pepTypes = [res];
        this.pepTypes = this.pepTypes[0].pepTypesMap;
      },
      error => {
        console.error('Error with onboarding service for pep types: ', error);
      }
    )
  }

  // Set countries
  setCountries() {
    this.registerService.getCountries().subscribe(
      res => {
        this.countries = [res];
        this.countries = this.countries[0].countriesMap;
      },
      error => {
        console.error('Error with register service for countries: ', error);
      }
    );
  }

  // Assign selected input file(s) to variables passed into FormGroup
  handlePoiFileInput(files: FileList) {
    this.proofOfIdentity = files[0];
    this.poiLabel = files[0].name;
  }

  handlePoaFileInput(files: FileList) {
    this.proofOfAddress = files[0];
    this.poaLabel = files[0].name;
  }
  
  // TODO: File check function for size and type
  // TODO: Look at FormData opt for File Input instead of assign variable

  // TODO: getApplication(username, id) -> return application data 
  // - GET application data from cloud db based on username and appId

  // Check if current address and permanent address are the same
  isAddressSame() {
    let sameAddress = this.individualApplicationForm.value.isSameAddress;
    return sameAddress === 'YES' ? true : false;
  }

  // Check if current step is complete
  isStepComplete(currentStep): boolean {
    if (currentStep === 1) {
      let isFirstNameValid = this.individualApplicationForm.controls['firstName'].valid;
      let isLastNameValid = this.individualApplicationForm.controls['lastName'].valid;
      let isMaidenNameValid = this.individualApplicationForm.controls['maidenName'].valid;
      let isFatherNameValid = this.individualApplicationForm.controls['fatherName'].valid;
      let isMotherNameValid = this.individualApplicationForm.controls['motherName'].valid;
      let isMotherMaidenNameValid = this.individualApplicationForm.controls['motherMaidenName'].valid;
      let isSpouseNameValid = this.individualApplicationForm.controls['spouseName'].valid;
      let isMaritalStatusValid = this.individualApplicationForm.controls['maritalStatus'].valid;
      let isGenderValid = this.individualApplicationForm.controls['gender'].valid;
      let isDobValid = this.individualApplicationForm.controls['dob'].valid;
      let isCitizenshipStatusValid = this.individualApplicationForm.controls['citizenshipStatus'].valid;
      let isOccupationValid = this.individualApplicationForm.controls['occupation'].valid;
      let isPepValid = this.individualApplicationForm.controls['isPEP'].valid;
      let isRcaPepValid = this.individualApplicationForm.controls['isRcaPEP'].valid;
      let isPepExposureValid = this.individualApplicationForm.controls['pepExposure'].valid;
      return isFirstNameValid && isLastNameValid && isMaidenNameValid && isFatherNameValid && isMotherNameValid && isMotherMaidenNameValid && isSpouseNameValid
        && isMaritalStatusValid && isGenderValid && isDobValid && isCitizenshipStatusValid && isOccupationValid && isPepValid && isRcaPepValid && isPepExposureValid;
    }
    else if (currentStep === 2) {
      let isPoiValid = this.individualApplicationForm.controls['poi'].valid;
      return isPoiValid;
    }
    else if (currentStep === 3) {
      let isAddressValid = this.individualApplicationForm.controls['address'].valid;
      let isCityValid = this.individualApplicationForm.controls['city'].valid;
      let isStateValid = this.individualApplicationForm.controls['state'].valid;
      let isPostalCodeValid = this.individualApplicationForm.controls['postalCode'].valid;
      let isCountryValid = this.individualApplicationForm.controls['country'].valid;
      let isSameAddressValid = this.individualApplicationForm.controls['isSameAddress'].valid;
      let isPAddressValid = !this.individualApplicationForm.hasError('addressRequired');
      let isPCityValid = !this.individualApplicationForm.hasError('cityRequired');
      let isPStateValid = !this.individualApplicationForm.hasError('stateRequired');
      let isPPostalCodeValid = !this.individualApplicationForm.hasError('postalCodeRequired');
      let isPCountryValid = !this.individualApplicationForm.hasError('countryRequired');

      return isAddressValid && isCityValid && isStateValid && isPostalCodeValid && isCountryValid && isSameAddressValid && isPAddressValid && isPCityValid && isPStateValid
        && isPPostalCodeValid && isPCountryValid;
    }
    else if (currentStep === 4) {
      let isPoaValid = this.individualApplicationForm.controls['poa'].valid;
      return isPoaValid;
    }
    else if (currentStep === 5) {
      let isEmailValid = this.individualApplicationForm.controls['email'].valid;
      let isPhoneValid = this.individualApplicationForm.controls['phone'].valid;
      return isEmailValid && isPhoneValid;
    }
    else if (currentStep === 6) {
      let isDeclaredValid = this.individualApplicationForm.value.isDeclared === true;
      return isDeclaredValid;
    }
  }

  // Go to next step in application
  nextStep() {
    var step = this.step;

    // Step 6 is final step in application. Go to application summary if completed else show alert message.
    if (step === 6) {
      var isComplete = this.isStepComplete(1) && this.isStepComplete(2) && this.isStepComplete(3) && this.isStepComplete(4) && this.isStepComplete(5) && this.isStepComplete(6);
      
      if (isComplete) {
        this.viewApplicationSummary();
      }
      else {
        var incompleteSteps = '';
        var stepNames = {
          1: 'Personal Details',
          2: 'ID Proof',
          3: 'Address Details',
          4: 'Proof of Address',
          5: 'Contact'
        }
        for(var i = 1; i < 6; i++) {
          if (!this.isStepComplete(i)) {
            var str = '<p>' + i + '. ' + stepNames[i] + '</p>'
            incompleteSteps += str;
          }
        }
        ApplicationNotCompleteAlert.fire({
          html:
            '<style> p{text-align: left}</style>' +
            '<p>Following steps are incomplete: ' +
            '</br></br>' +
            incompleteSteps +
            '</p>'
        });
      }
    }
    else {
      this.currentStep(step);
      step = step + 1;
      this.steps[step - 1].progress = 'IP';

      if (step === 6) {
        this.forwardButtonText = 'Review';
      }
    }
    this.step = step;
  }

  // Set current step progress to complete if valid completion
  currentStep(step) {
    var isComplete = this.isStepComplete(step);
    this.steps[step - 1].progress = isComplete ? 'C' : 'IC';
  }

  showPreviousButton(): boolean {
    return this.step != 1;
  }

  // Go to previous step in application
  previousStep() {
    var step = this.step;
    this.currentStep(step)
    step = step - 1;
    this.steps[step - 1].progress = 'IP';

    this.forwardButtonText = 'Next';
    this.step = step;
  }

  // After applicaiton is complete user must review information before submission
  viewApplicationSummary() {
    // TODO: add var to enable view of information. maybe component variable.
  }

  // Submit application to blockchain
  onSubmit() {
    // TODO: show alert message stating where application will go ask again for assurance of submission
    // TODO: submit application to web3.storage
    // TODO: save CID for application on blockchain to KOS db
  }

}
