import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicationValidationService } from 'src/app/services/kyc-onboarding/application-validation.service';
import { KycOnboardingService } from 'src/app/services/kyc-onboarding/kyc-onboarding.service';
import { RegisterService } from 'src/app/services/register.service';
import { UserService } from 'src/app/services/user.service';
import { ApplicationDeletedAlert, ApplicationNotCompleteAlert, ApplicationSavedAlert, ApplicationSubmittedAlert, DeleteApplicationAlert, FailedDeleteApplicationAlert, FailedFileUploadAlert, FailedSaveApplicationAlert, FailedSubmitApplicationAlert, SubmitApplicationAlert } from 'src/constants/alerts.constant';

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
  user: any[];
  
  individualApplicationForm: FormGroup;
  applicationId: String;
  applicationType: String;
  step: number;
  forwardButtonText = 'Next';
  showApplicationReview = false;
  forwardButtonColor = 'bg-sky-500';

  poiLabel = 'Select a photo';
  poiFile: File;
  poaLabel = 'Select a document';
  poaFile: File;
  
  pepTypes = [];
  countries = [];

  applicationDetails = [];

  // Array for existing application from mongodb
  applicationData = [];

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
    private registerService: RegisterService,
    private userService: UserService,
    private router: Router,

  ) {}

  ngOnInit(): void {
    // Get user to get application data
    this.user = this.userService.getUserData();

    // Select field data in application
    this.setPepTypes();
    this.setCountries();

    // Initial application start at Step 1
    this.step = this.steps[0].step;
    this.steps[0].progress = 'IP';

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
      pepFullName: [''],
      poiType: ['', [Validators.required]], 
      poiFile: ['', [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      postalCode: ['', Validators.compose([
        Validators.required,
        Validators.pattern(this.applicationValidator.postalCodePattern)
      ])],
      country: ['', [Validators.required]],
      isSameAddress: [''],
      permanentAddress: [''],
      permanentCity: [''],
      permanentState: [''],
      permanentPostalCode: ['', Validators.compose([
        Validators.pattern(this.applicationValidator.postalCodePattern)
      ])],
      permanentCountry: [''],
      poaType: ['', [Validators.required]],
      poaFile: [File = null, [Validators.required]],
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

    this.getApplication();
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
    let tenMBs = 10000000;
    let file = files[0];
    let isCorrectFileType = this.applicationValidator.poiFilePattern.test(file.name);
    let isCorrectFileSize = file.size < tenMBs;

    if (isCorrectFileType && isCorrectFileSize) {
      this.individualApplicationForm.controls.poiFile.setValue(file ? file.name : '');
      this.poiFile = file;
      this.poiLabel = file.name;
    } else {
      this.showFileUploadError(isCorrectFileType, isCorrectFileSize);
    }
  }

  handlePoaFileInput(files: FileList) {
    let tenMBs = 10000000;
    let file = files[0];
    
    let isCorrectFileType = this.applicationValidator.poaFilePattern.test(file.name);
    let isCorrectFileSize = file.size < tenMBs;

    if (isCorrectFileType && isCorrectFileSize) {
      this.individualApplicationForm.controls.poaFile.setValue(file ? file.name : '');
      this.poaFile = file;
      this.poaLabel = file.name;
    } else {
      this.showFileUploadError(isCorrectFileType, isCorrectFileSize);
    }
  }

  removeFile(fileType) {
    if (fileType === 'poi') {
      this.individualApplicationForm.controls.poiFile.setValue(null);
    } else if (fileType === 'poa') {
      this.individualApplicationForm.controls.poaFile.setValue(null);
    }
  }

  showFileUploadError(correctType, correctSize) {
    var error = '';
      if (!correctType) {
        error += 'Incorrect file type.';
      }
      if (!correctSize) {
        error += ' File is too large for data storage. Must be under 10 MB.';
      }
      FailedFileUploadAlert(error).fire({});
  }

  showRemoveFileButton() {
    let poiFile = this.individualApplicationForm.controls['poiFile'].value;
    let poaFile = this.individualApplicationForm.controls['poaFile'].value;

    if (this.step === 2) {
      return poiFile != null;
    } else if (this.step === 4) {
      return poaFile != null;
    }
  }

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
      let isPoiTypeValid = this.individualApplicationForm.controls['poiType'].valid;
      let isPoiFileValid = this.individualApplicationForm.controls['poiFile'].valid;
      return isPoiTypeValid && isPoiFileValid;
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
      let isPoaTypeValid = this.individualApplicationForm.controls['poaType'].valid;
      let isPoaFileValid = this.individualApplicationForm.controls['poaFile'].valid;
      return isPoaTypeValid && isPoaFileValid;
    }
    else if (currentStep === 5) {
      let isEmailValid = this.individualApplicationForm.controls['email'].valid;
      let isPhoneValid = this.individualApplicationForm.controls['phone'].valid;
      return isEmailValid && isPhoneValid;
    }
    else if (currentStep === 6) {
      let isDeclaredValid = this.individualApplicationForm.controls['isDeclared'].value === true;
      return isDeclaredValid;
    }
  }

  // Go to next step in application
  nextStep() {
    var step = this.step;

    // Step 6 is final step in application. Go to application summary if completed else show alert message.
    if (step === 6) {
      if (this.forwardButtonText === 'Submit') {
        this.onSubmit();
        return;
      }
      var isComplete = this.isStepComplete(1) && this.isStepComplete(2) && this.isStepComplete(3) && this.isStepComplete(4) && this.isStepComplete(5) && this.isStepComplete(6);
      this.currentStep(step);

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

    if (this.showApplicationReview) {
      this.showApplicationReview = false;
      this.forwardButtonColor = 'bg-sky-500';
      this.forwardButtonText = 'Review';
      this.step = step;
    } else {
      step = step - 1;
      this.steps[step - 1].progress = 'IP';

      this.forwardButtonText = 'Next';
      this.step = step;
    }
  }

  // After applicaiton is complete user may review information before submission
  viewApplicationSummary() {
    this.forwardButtonText = 'Submit';
    this.forwardButtonColor = 'bg-red-500';

    let form = this.individualApplicationForm.controls;

    let pepExposure = this.pepTypes.filter(type => type.code === Number(form.pepExposure.value))[0].name;
    let citizenshipStatus = this.citizenshipTypes.filter(type => type.code === Number(form.citizenshipStatus.value))[0].name;

    let poiFileName = form.poiFile.value;
    let poaFileName = form.poaFile.value;

    let address2 = form.city.value + ', ' + form.state.value + ' ' + form.postalCode.value;
    let address3 = form.permanentCity.value + ', ' + form.permanentState.value + ' ' + form.permanentPostalCode.value;
    let isSame = form.isSameAddress.value === 'YES';
    let permanentAddress = isSame ? form.address.value : form.permanentAddress.value;
    let permanentAddress2 = isSame ? address2 : address3;
    let permanentCountry = isSame ? form.country.value : form.permanentCountry.value;

    let formDetails = {
      applicationType: this.applicationType,
      firstName: form.firstName.value,
      lastName: form.lastName.value,
      maidenName: form.maidenName.value,
      fatherName: form.fatherName.value,
      motherName: form.motherName.value,
      motherMaidenName: form.motherMaidenName.value,
      spouseName: form.spouseName.value,
      maritalStatus: form.maritalStatus.value,
      gender: form.gender.value,
      dob: form.dob.value,
      citizenshipStatus: citizenshipStatus,
      occupation: form.occupation.value,
      isPEP: form.isPEP.value,
      isRcaPEP: form.isRcaPEP.value,
      pepExposure: pepExposure,
      pepFullName: form.pepFullName.value,
      poiType: form.poiType.value,
      poiFile: poiFileName,
      address: form.address.value,
      address2: address2,
      country: form.country.value,
      permanentAddress: permanentAddress,
      permanentAddress2: permanentAddress2,
      permanentCountry: permanentCountry,
      poaType: form.poaType.value,
      poaFile: poaFileName,
      phone: form.phone.value,
      email: form.email.value,
      isDeclared: form.isDeclared.value
    };

    this.applicationDetails.push(formDetails);
    this.showApplicationReview = true;
  }

  setApplicationFields() {
    let applicationDetails = this.applicationData[0].applicationDetails
    this.applicationId = applicationDetails.application_id;
    this.applicationType = applicationDetails.application_type;
    
    let details = applicationDetails.details;
    let documents = applicationDetails.documents;
    let individualForm = this.individualApplicationForm.controls;

    // Personal Details
    individualForm.firstName.setValue(details[0].first_name);
    individualForm.lastName.setValue(details[0].last_name);
    individualForm.maidenName.setValue(details[0].maiden_name);
    individualForm.fatherName.setValue(details[0].father_name);
    individualForm.motherName.setValue(details[0].mother_name);
    individualForm.motherMaidenName.setValue(details[0].mother_maidenname);
    individualForm.spouseName.setValue(details[0].spouse_name);
    individualForm.maritalStatus.setValue(details[0].marital_status);
    individualForm.gender.setValue(details[0].gender);
    individualForm.dob.setValue(details[0].dob);
    individualForm.citizenshipStatus.setValue(details[0].citizenship_status);
    individualForm.occupation.setValue(details[0].occupation);
    individualForm.isPEP.setValue(details[0].pep);
    individualForm.isRcaPEP.setValue(details[0].rca_pep);
    individualForm.pepExposure.setValue(details[0].pep_exposure);
    individualForm.pepFullName.setValue(details[0].pep_fullname);
    
    // ID Proof
    if (documents != []) {
      let poiType = documents[0]?.poi?.file_name?.slice(10, 12);
      individualForm.poiType.setValue(poiType);

      individualForm.poiFile.setValue(documents[0]?.poi.file_name);
      this.poiLabel = individualForm.poiFile.value != undefined ? individualForm.poiFile.value : this.poiLabel;
    }
    
    // Address Details
    individualForm.address.setValue(details[0].current_address.address);
    individualForm.city.setValue(details[0].current_address.city);
    individualForm.state.setValue(details[0].current_address.state);
    individualForm.postalCode.setValue(details[0].current_address.postal_code);
    individualForm.country.setValue(details[0].current_address.country);
    individualForm.permanentAddress.setValue(details[0].permanent_address.address);
    individualForm.permanentCity.setValue(details[0].permanent_address.city);
    individualForm.permanentState.setValue(details[0].permanent_address.state);
    individualForm.permanentPostalCode.setValue(details[0].permanent_address.postal_code);
    individualForm.permanentCountry.setValue(details[0].permanent_address.country);
    
    // Proof of Address
    if (documents != []) {
      let poaType = documents[0]?.poa?.file_name?.slice(10, 12);
      individualForm.poaType.setValue(poaType);
      individualForm.poaFile.setValue(documents[0]?.poa.file_name);
      this.poaLabel = individualForm.poaFile.value != undefined ? individualForm.poaFile.value : this.poaLabel;
    }

    // Contact
    individualForm.email.setValue(details[0].email);
    individualForm.phone.setValue(details[0].phone);

    // Declaration
    individualForm.isDeclared.setValue(details[0].declared);
  }

  getApplication() {
    this.isLoading = true;
    let customerId = 'C' + this.user[0].username.slice(-12); 

    this.onboardingService.getApplication(customerId).subscribe(
      res => {
        this.isLoading = false;
        this.applicationData = [res];
        this.setApplicationFields();
      },
      error => {
        this.isLoading = false;
        console.error('Error getting application data for customer: ', error);
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

  onSave() {    
    this.isLoading = true;
    this.uploadDocument('poi');
    this.uploadDocument('poa');
    this.updateApplicationDetails(false);
  }

  isNewDocument(kycType: String) {
    var formDocument: String;
    let applicationDetails = this.applicationData[0].applicationDetails
    var dbDocument: String;
    var dbFilename: String

    if (kycType === 'poi') {
      formDocument = this.individualApplicationForm.controls.poiFile.value;
      dbDocument = applicationDetails.documents[0]?.poi.original_name;
      dbFilename = applicationDetails.documents[0]?.poi.file_name;
    } else if (kycType == 'poa') {
      dbDocument = applicationDetails.documents[0]?.poa.original_name;
      formDocument = this.individualApplicationForm.controls.poaFile.value;
      dbFilename = applicationDetails.documents[0]?.poa.file_name;
    }

    if (formDocument === undefined) {
      return 'EMPTY';
    }
    if (formDocument === dbDocument || formDocument === dbFilename) {
      return 'EXIST'
    } else if (formDocument != dbDocument) {
      return 'UPDATE';
    } 
  }

  updateApplicationDetails(isSubmit: boolean) {
    let form = this.individualApplicationForm.controls;

    let isSame = form.isSameAddress.value === 'YES';
    let permanentAddress = isSame ? form.address.value : form.permanentAddress.value;
    let permanentCity = isSame ? form.city.value : form.permanentCity.value;
    let permanentState = isSame ? form.state.value : form.permanentState.value;
    let permanentPostalCode = isSame ? form.postalCode.value : form.permanentPostalCode.value;
    let permanentCountry = isSame ? form.country.value : form.permanentCountry.value;

    let formDetails = {
      first_name: form.firstName.value,
      last_name: form.lastName.value,
      maiden_name: form.maidenName.value,
      father_name: form.fatherName.value,
      mother_name: form.motherName.value,
      mother_maidenname: form.motherMaidenName.value,
      spouse_name: form.spouseName.value,
      marital_status: form.maritalStatus.value,
      gender: form.gender.value,
      dob: form.dob.value,
      citizenship_status: Number(form.citizenshipStatus.value),
      occupation: form.occupation.value,
      pep: form.isPEP.value,
      rca_pep: form.isRcaPEP.value,
      pep_exposure: Number(form.pepExposure.value),
      pep_fullname: form.pepFullName.value,
      current_address: {
        address: form.address.value,
        city: form.city.value,
        state: form.state.value,
        postal_code: form.postalCode.value,
        country: form.country.value
      },
      permanent_address: {
        address: permanentAddress,
        city: permanentCity,
        state: permanentState,
        postal_code: permanentPostalCode,
        country: permanentCountry
      },
      email: form.email.value,
      phone: form.phone.value,
      declared: form.isDeclared.value
    };

    let detailsObj = {
      applicationId: this.applicationId,
      details: [formDetails]
    }

    this.onboardingService.updateApplicationDetails(detailsObj).subscribe(
      res => {
        this.getApplication();
        this.isLoading = false;
        if (!isSubmit) {
          ApplicationSavedAlert.fire({});
        }
        console.log('response: ', res);
      },
      error => {
        this.isLoading = false;
        FailedSaveApplicationAlert(error).fire({});
      }
    );
  }

  uploadDocument(kycType: String) {
    let newDocument =  this.isNewDocument(kycType);
    console.log(newDocument);
    let documentObj = {};

    if (kycType === 'poi') {
      documentObj = {
        applicationId: this.applicationId,
        documentType: 'poi',
        file: this.poiFile,
        kycType: this.individualApplicationForm.controls.poiType.value
      }
    } else if (kycType === 'poa') {
      documentObj = {
        applicationId: this.applicationId,
        documentType: 'poa',
        file: this.poaFile,
        kycType: this.individualApplicationForm.controls.poaType.value
      }
    }

    if (newDocument === 'UPDATE') {
      this.onboardingService.updateDocument(documentObj).subscribe(
        res => {
          this.isLoading = false;
          console.log('Update document: ', res);
        },
        error => {
          this.isLoading = false;
          console.error('Error updating document: ', error);
        }
      );
    } else if (newDocument === 'EXIST') {
      console.log('Document already exists in database');
    }
  }

  submitApplication() {
    this.isLoading = true;
    // Save application before submitting
    this.uploadDocument('poi');
    this.uploadDocument('poa');
    this.updateApplicationDetails(true);

    this.onboardingService.submitApplication(this.applicationId).subscribe(
      res => {
        this.isLoading = false;
        ApplicationSubmittedAlert(this.applicationId).fire({})
          .then(() => {
            this.router.navigate(['/user/kyc/onboarding/dashboard']);
          });
        console.log('response: ', res);
      },
      error => {
        this.isLoading = false;
        FailedSubmitApplicationAlert(error).fire({});
      }
    );
  }

  onDelete() {
    DeleteApplicationAlert.fire({})
      .then((result) => {
        if (result.isConfirmed === true) {
          this.deleteApplication();
        }
      });
  }

  // Submit application to blockchain (Web3 Storage)
  onSubmit() {
    SubmitApplicationAlert.fire({})
      .then((result) => {
        if (result.isConfirmed === true) {
          this.submitApplication();
        }
      });    
  }

  reloadPage() {
    window.location.reload();
  }

}
