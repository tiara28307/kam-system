import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicationValidationService } from 'src/app/services/kyc-onboarding/application-validation.service';
import { KycOnboardingService } from 'src/app/services/kyc-onboarding/kyc-onboarding.service';
import { RegisterService } from 'src/app/services/register.service';
import { UserService } from 'src/app/services/user.service';
import { ApplicationDeletedAlert, ApplicationNotCompleteAlert, ApplicationSavedAlert, DeleteApplicationAlert, FailedDeleteApplicationAlert, FailedFileUploadAlert, FailedSaveApplicationAlert } from 'src/constants/alerts.constant';

@Component({
  selector: 'app-card-business-application',
  templateUrl: './card-business-application.component.html',
  styles: [
  ]
})
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

  pobLabel = 'Select a document';
  poaLabel = 'Select a document';
  
  countries = [];

  businessTypes = [
    { code: 1, name: 'Corporate' },
    { code: 2, name: 'Partnership Firm' },
    { code: 3, name: 'Trust, Charity, or NGO' },
    { code: 4, name: 'Other' },
    { code: 5, name: 'Military or Government Body' },
    { code: 6, name: 'Bank or Institutional Investor' },
    { code: 7, name: 'Foreign Insitutional Investor (FII)' },
    { code: 8, name: 'Registered Society' },
    { code: 9, name: 'Unincorporated Association or Body of Individuals' }
  ];

  pobTypes = [
    {code: 'RC', name: 'Registration Certificate'},
    {code: 'CMA', name: 'Certificate/Licence issued by Municipal authorities'},
    {code: 'SIT', name: 'Sales or income tax returns'},
    {code: 'CVC', name: 'CST/VAT certificate'},
    {code: 'PD', name: 'Partnership Deed'},
    {code: 'TD', name: 'Trust Deed'},
    {code: 'CI', name: 'Certificate of Incorporation'},
    {code: 'MAA', name: 'Memorandum/Articles of Association'},
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
      pobType: ['', [Validators.required]],
      pobFile: [null, [Validators.required]],
      address: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      postalCode: ['', Validators.compose([
        Validators.required,
        Validators.pattern(this.applicationValidator.postalCodePattern)
      ])],
      country: ['', [Validators.required]],
      poaType: ['', [Validators.required]],
      poaFile: [null, [Validators.required]],
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
  handlePobFileInput(files: FileList) {
    let tenMBs = 10000000;
    let file = files[0];
    
    let isCorrectFileType = this.applicationValidator.pobFilePattern.test(file.name);
    let isCorrectFileSize = file.size < tenMBs;

    if (isCorrectFileType && isCorrectFileSize) {
      this.businessApplicationForm.controls.pobFile.setValue(file);
      this.pobLabel = file.name;
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
      this.businessApplicationForm.controls.poaFile.setValue(file);
      this.poaLabel = file.name;
    } else {
      this.showFileUploadError(isCorrectFileType, isCorrectFileSize);
    }
  }

  // TODO: add remove file button
  removeFile(fileType) {
    if (fileType === 'pob') {
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
      let isPobTypeValid = form.pobType.valid;
      let isPobFileValid = form.pobFile.valid;
      return isPobTypeValid && isPobFileValid;
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
      pobType: form.pobType.value,
      pobFile: form.pobFile.value,
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
    businessForm.pobType.setValue(details[0].pob_type);
    businessForm.pobFile.setValue(details[0].pob_file);
    
    // Address Details
    businessForm.address.setValue(details[0].company_address.address);
    businessForm.city.setValue(details[0].company_address.city);
    businessForm.state.setValue(details[0].company_address.state);
    businessForm.postalCode.setValue(details[0].company_address.postal_code);
    businessForm.country.setValue(details[0].company_address.country);
    
    // Proof of Address
    businessForm.poaType.setValue(details[0].poa_type);
    businessForm.poaFile.setValue(details[0].poa_file);

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
    let form = this.businessApplicationForm.controls;

    let pobFileName = form.pobFile.value;
    let poaFileName = form.poaFile.value;

    let formDetails = {
      company_name: form.companyName.value,
      employee_firstname: form.employeeFirstName.value,
      employee_lastname: form.employeeLastName.value,
      date_incorporation: form.dateOfIncorporation.value,
      state_incorporation: form.stateOfIncorporation.value,
      registration_number: form.registrationNumber.value,
      date_commencement: form.dateOfCommencement.value,
      company_type: form.companyType.value,
      pob_type: form.pobType.value,
      pob_file: pobFileName,
      company_address: {
        address: form.address.value,
        city: form.city.value,
        state: form.state.value,
        postal_code: form.postalCode.value,
        country: form.country.value
      },
      poa_type: form.poaType.value,
      poa_file: poaFileName,
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
        this.isLoading = false;
        ApplicationSavedAlert.fire({});
        console.log('response: ', res);
      },
      error => {
        this.isLoading = false;
        FailedSaveApplicationAlert(error).fire({});
      }
    );
  }

  // Submit application to blockchain
  onSubmit() {
    // TODO: show alert message stating where application will go ask again for assurance of submission
    // TODO: loading wheel for page true
    // TODO: save application to cloudDB
    // TODO: submit application to web3.storage
    // TODO: submit documents to web3.storage
    // TODO: save CID for application on blockchain to KOS db
  }
}
