import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicationValidationService } from 'src/app/services/kyc-onboarding/application-validation.service';
import { KycOnboardingService } from 'src/app/services/kyc-onboarding/kyc-onboarding.service';
import { RegisterService } from 'src/app/services/register.service';
import { UserService } from 'src/app/services/user.service';
import { ApplicationDeletedAlert, ApplicationNotCompleteAlert, ApplicationSavedAlert, ApplicationSubmittedAlert, DeleteApplicationAlert, FailedDeleteApplicationAlert, FailedFileUploadAlert, FailedSaveApplicationAlert, FailedSubmitApplicationAlert, SubmitApplicationAlert } from 'src/constants/alerts.constant';

@Component({
  selector: 'app-card-business-application',
  templateUrl: './card-business-application.component.html',
  styles: [
  ]
})
/* 
  Component for Business Customer Application Form
*/
export class CardBusinessApplicationComponent implements OnInit {
  isLoading = false;
  user: any[];
  
  businessApplicationForm: FormGroup;
  applicationId: String;
  applicationType: String;
  step: number;
  forwardButtonText = 'Next';
  showApplicationReview = false;
  forwardButtonColor = 'bg-sky-500';

  poiLabel = 'Select a document';
  poiFile: File;
  poaLabel = 'Select a document';
  poaFile: File;
  
  countries = [];

  businessTypes = [
    { code: 1, name: 'Corporate' },
    { code: 2, name: 'Partnership Firm' },
    { code: 3, name: 'Trust, Charity, or NGO' },
    { code: 4, name: 'Other' },
    { code: 5, name: 'Military or Government Agency' },
    { code: 6, name: 'Bank or Institutional Investor' },
    { code: 7, name: 'Foreign Insitutional Investor (FII)' },
    { code: 8, name: 'Registered Society' },
    { code: 9, name: 'Unincorporated Association or Body of Individuals' },
    { code: 10, name: 'Information Technology' },
    { code: 11, name: 'Health Care' },
    { code: 12, name: 'Mission' },
    { code: 13, name: 'Private Investment Company PIC' },
    { code: 14, name: 'LLC' },
  ];

  proofOfBusiness = [
    {code: 'RC', name: 'Registration Certificate'},
    {code: 'CM', name: 'Certificate/Licence issued by Municipal authorities'},
    {code: 'ST', name: 'Sales or income tax returns'},
    {code: 'CV', name: 'CST/VAT certificate'},
    {code: 'PD', name: 'Partnership Deed'},
    {code: 'TD', name: 'Trust Deed'},
    {code: 'CI', name: 'Certificate of Incorporation'},
    {code: 'MA', name: 'Memorandum/Articles of Association'},
  ]

  applicationDetails = [];

  // Array for existing application from mongodb
  applicationData = [];

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
    private router: Router
  ) { }

  ngOnInit(): void {
    // Get user to get application data
    this.user = this.userService.getUserData();

    // Select field data in application
    this.setCountries();

    // Initial application start at Step 1
    this.step = this.steps[0].step;
    this.steps[0].progress = 'IP';

    // Build form for business application with input validation scheme
    this.businessApplicationForm = this.formBuilder.group({
      companyName: ['', [Validators.required]],
      employeeFirstName: ['', [Validators.required]],
      employeeLastName: ['', [Validators.required]],
      dateOfIncorporation: ['', [Validators.required]],
      stateOfIncorporation: ['', [Validators.required]],
      registrationNumber: ['', [Validators.required]],
      dateOfCommencement: ['', [Validators.required]],
      companyType: ['', [Validators.required]],
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
      poaType: ['', [Validators.required]],
      poaFile: ['', [Validators.required]],
      employeePhone: ['', Validators.compose([
        Validators.required,
        Validators.pattern(this.applicationValidator.phonePattern)
      ])],
      employeeEmail: ['', Validators.compose([
        Validators.required,
        Validators.email
      ])],
      isDeclared: [false, [Validators.required]],
    });

    this.getApplication();
  }

  // Set format for date field(s) on change
  onDateIncorporationKey(event: KeyboardEvent, formField: String) {
    let val = this.businessApplicationForm.controls['dateOfIncorporation'].value;

    val = val.replace(/^(\d\d)(\d)$/g,'$1/$2').replace(/^(\d\d\/\d\d)(\d+)$/g,'$1/$2').replace(/[^\d\/]/g,'');
    this.businessApplicationForm.controls['dateOfIncorporation'].setValue(val);
  }

  onDateCommencementKey(event: KeyboardEvent, formField: String) {
    let val = this.businessApplicationForm.controls['dateOfCommencement'].value;

    val = val.replace(/^(\d\d)(\d)$/g,'$1/$2').replace(/^(\d\d\/\d\d)(\d+)$/g,'$1/$2').replace(/[^\d\/]/g,'');
    this.businessApplicationForm.controls['dateOfCommencement'].setValue(val);
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
    
    let isCorrectFileType = this.applicationValidator.pobFilePattern.test(file.name);
    let isCorrectFileSize = file.size < tenMBs;

    if (isCorrectFileType && isCorrectFileSize) {
      this.businessApplicationForm.controls.poiFile.setValue(file ? file.name : '');
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
      this.businessApplicationForm.controls.poaFile.setValue(file ? file.name : '');
      this.poaFile = file;
      this.poaLabel = file.name;
    } else {
      this.showFileUploadError(isCorrectFileType, isCorrectFileSize);
    }
  }

  // TODO: add remove file button
  removeFile(fileType) {
    if (fileType === 'poi') {
      this.businessApplicationForm.controls.poiFile.setValue(null);
    } else if (fileType === 'poa') {
      this.businessApplicationForm.controls.poaFile.setValue(null);
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

  // Check if current step is complete
  isStepComplete(currentStep): boolean {
    let form = this.businessApplicationForm.controls;
    if (currentStep === 1) {
      let isCompanyNameValid = form.companyName.valid;
      let isEmployeeFirstNameValid = form.employeeFirstName.valid;
      let isEmployeeLastNameValid = form.employeeLastName.valid;
      let isDateOfIncorporationValid = form.dateOfIncorporation.valid;
      let isStateOfIncorporationValid = form.stateOfIncorporation.valid;
      let isRegistrationNumberValid = form.registrationNumber.valid;
      let isDateOfCommencementValid = form.dateOfCommencement.valid;
      let isCompanyTypeValid = form.companyType.valid;

      return isCompanyNameValid && isEmployeeFirstNameValid && isEmployeeLastNameValid && isDateOfIncorporationValid && isStateOfIncorporationValid 
        && isRegistrationNumberValid && isDateOfCommencementValid && isCompanyTypeValid;
    }
    else if (currentStep === 2) {
      let isPoiTypeValid = form.poiType.valid;
      let isPoiFileValid = form.poiFile.valid;
      return isPoiTypeValid && isPoiFileValid;
    }
    else if (currentStep === 3) {
      let isAddressValid = form.address.valid;
      let isCityValid = form.city.valid;
      let isStateValid = form.state.valid;
      let isPostalCodeValid = form.postalCode.valid;
      let isCountryValid = form.country.valid;

      return isAddressValid && isCityValid && isStateValid && isPostalCodeValid && isCountryValid;
    }
    else if (currentStep === 4) {
      let isPoaTypeValid = form.poaType.valid;
      let isPoaFileValid = form.poaFile.valid;
      return isPoaTypeValid && isPoaFileValid;
    }
    else if (currentStep === 5) {
      let isEmailValid = form.employeeEmail.valid;
      let isPhoneValid = form.employeePhone.valid;
      return isEmailValid && isPhoneValid;
    }
    else if (currentStep === 6) {
      let isDeclaredValid = form.isDeclared.value === true;
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
            1: 'Company Details',
            2: 'Proof of Business',
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

    let form = this.businessApplicationForm.controls;
    let companyType = this.businessTypes.filter(type => type.code === Number(form.companyType.value))[0].name;
    let address2 = form.city.value + ' ' + form.state.value + ', ' + form.postalCode.value;

    let formDetails = {
      applicationType: this.applicationType,
      companyName: form.companyName.value,
      employeeFirstName: form.employeeFirstName.value,
      employeeLastName: form.employeeLastName.value,
      dateOfIncorporation: form.dateOfIncorporation.value,
      stateOfIncorporation: form.stateOfIncorporation.value,
      registrationNumber: form.registrationNumber.value,
      dateOfCommencement: form.dateOfCommencement.value,
      companyType: companyType,
      poiType: form.poiType.value,
      poiFile: form.poiFile.value,
      address: form.address.value,
      address2: address2,
      country: form.country.value,
      poaType: form.poaType.value,
      poaFile: form.poaFile.value,
      employeePhone: form.employeePhone.value,
      employeeEmail: form.employeeEmail.value,
      isDeclared: form.isDeclared.value
    };

    this.applicationDetails.push(formDetails);
    this.showApplicationReview = true;
  }

  setApplicationFields() {
    let applicationDetails = this.applicationData[0].applicationDetails
    this.applicationId = applicationDetails.application_id;
    this.applicationType = applicationDetails.application_type;
    let documents = applicationDetails.documents;
    
    let details = applicationDetails.details;
    let businessForm = this.businessApplicationForm.controls;

    // Company Details
    businessForm.companyName.setValue(details[0].company_name);
    businessForm.employeeFirstName.setValue(details[0].employee_firstname);
    businessForm.employeeLastName.setValue(details[0].employee_lastname);
    businessForm.dateOfIncorporation.setValue(details[0].date_incorporation);
    businessForm.stateOfIncorporation.setValue(details[0].state_incorporation);
    businessForm.registrationNumber.setValue(details[0].registration_number);
    businessForm.dateOfCommencement.setValue(details[0].date_commencement);
    businessForm.companyType.setValue(details[0].company_type);
    
    // Proof of Business
    if (documents[0]?.poi !== [] && !(documents[0]?.poi.length === 0)) {
      businessForm.poiType.setValue(documents[0]?.poi?.file_name?.slice(10, 12));
      businessForm.poiFile.setValue(documents[0]?.poi.file_name);
      this.poiLabel = businessForm.poiFile.value != undefined ? businessForm.poiFile.value : this.poiLabel;
    }
    
    // Address Details
    businessForm.address.setValue(details[0].company_address.address);
    businessForm.city.setValue(details[0].company_address.city);
    businessForm.state.setValue(details[0].company_address.state);
    businessForm.postalCode.setValue(details[0].company_address.postal_code);
    businessForm.country.setValue(details[0].company_address.country);
    
    // Proof of Address
    if (documents[0]?.poa !== [] && !(documents[0]?.poa.length === 0)) {
      businessForm.poaType.setValue(documents[0]?.poa?.file_name?.slice(10, 12));
      businessForm.poaFile.setValue(documents[0]?.poa.file_name);
      this.poaLabel = businessForm.poaFile.value != undefined ? businessForm.poaFile.value : this.poaLabel;
    }

    // Contact
    businessForm.employeeEmail.setValue(details[0].emp_email);
    businessForm.employeePhone.setValue(details[0].emp_phone);

    // Declaration
    businessForm.isDeclared.setValue(details[0].declared);
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

  onDelete() {
    DeleteApplicationAlert.fire({})
      .then((result) => {
        if (result.isConfirmed === true) {
          this.deleteApplication();
        }
      });
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
      formDocument = this.businessApplicationForm.controls.poiFile.value;
      dbDocument = applicationDetails.documents[0]?.poi.original_name;
      dbFilename = applicationDetails.documents[0]?.poi.file_name;
    } else if (kycType == 'poa') {
      dbDocument = applicationDetails.documents[0]?.poa.original_name;
      formDocument = this.businessApplicationForm.controls.poaFile.value;
      dbFilename = applicationDetails.documents[0]?.poa.file_name;
    }

    if (formDocument === undefined || !(formDocument.length > 0) ) {
      return 'EMPTY';
    }
    if (formDocument === dbDocument || formDocument === dbFilename) {
      return 'EXIST'
    } else if (formDocument != dbDocument) {
      return 'UPDATE';
    } 
  }

  updateApplicationDetails(isSubmit: boolean) {
    let form = this.businessApplicationForm.controls;

    let formDetails = {
      company_name: form.companyName.value,
      employee_firstname: form.employeeFirstName.value,
      employee_lastname: form.employeeLastName.value,
      date_incorporation: form.dateOfIncorporation.value,
      state_incorporation: form.stateOfIncorporation.value,
      registration_number: form.registrationNumber.value,
      date_commencement: form.dateOfCommencement.value,
      company_type: form.companyType.value,
      company_address: {
        address: form.address.value,
        city: form.city.value,
        state: form.state.value,
        postal_code: form.postalCode.value,
        country: form.country.value
      },
      emp_email: form.employeeEmail.value,
      emp_phone: form.employeePhone.value,
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

  submitApplication() {
    this.isLoading = true;
    // Save application before submitting
    this.uploadDocument('poi');
    this.uploadDocument('poa');
    this.updateApplicationDetails(true);

    this.onboardingService.submitApplication(this.applicationId).subscribe(
      res => {
        this.isLoading = false;
        console.log('response: ', res);
        ApplicationSubmittedAlert(this.applicationId).fire({})
          .then(() => {
            this.router.navigate(['/user/kyc/onboarding/dashboard']);
          });
      },
      error => {
        this.isLoading = false;
        FailedSubmitApplicationAlert(error).fire({});
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
        kycType: this.businessApplicationForm.controls.poiType.value
      }
    } else if (kycType === 'poa') {
      documentObj = {
        applicationId: this.applicationId,
        documentType: 'poa',
        file: this.poaFile,
        kycType: this.businessApplicationForm.controls.poaType.value
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

  // Submit application to blockchain
  onSubmit() {
    SubmitApplicationAlert.fire({})
      .then((result) => {
        if (result.isConfirmed === true) {
          this.submitApplication();
        }
      });  
  }
}
