import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApplicationValidationService } from 'src/app/services/kyc/application-validation.service';
import { KycOnboardingService } from 'src/app/services/kyc/kyc-onboarding.service';

@Component({
  selector: 'app-card-individual-application',
  templateUrl: './card-individual-application.component.html',
  styles: [
  ]
})
export class CardIndividualApplicationComponent implements OnInit {
  individualApplicationForm: FormGroup;
  step: number;
  stepTitle: string;
  isLoading = false;
  proofOfIdentity: File;
  proofOfAddress: File;
  pepTypes = [];
  citizenshipTypes = [
    { code: 1, name: 'U.S. Citizen or U.S. National' },
    { code: 2, name: 'U.S. Dual Citizen' },
    { code: 3, name: 'U.S. Permanent Resident' },
    { code: 4, name: 'U.S. Refugee or Asylee' },
    { code: 5, name: 'Other (Non-U.S.)' }
  ];
  steps = [
    { step: 1, title: 'Personal' },
    { step: 2, title: 'ID Proof' },
    { step: 3, title: 'Address' },
    { step: 4, title: 'Proof of Address' },
    { step: 5, title: 'Contact' },
    { step: 6, title: 'Declaration' },
  ];
  
  constructor(
    private formBuilder: FormBuilder,
    private applicationValidator: ApplicationValidationService,
    private onboardingService: KycOnboardingService
  ) {}

  ngOnInit(): void {
    this.step = this.steps[0].step;
    this.stepTitle = this.steps[0].title;
    this.setPepTypes();

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
      isPEP: [false, [Validators.required]],
      isRcaPEP: [false, [Validators.required]],
      pepExposure: ['', [Validators.required]], 
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
      isConfirmed: [false, [Validators.required]],
    });
  }

  onDateKey(event: KeyboardEvent) {
    let dobVal = this.individualApplicationForm.controls['dob'].value;

    dobVal = dobVal.replace(/^(\d\d)(\d)$/g,'$1/$2').replace(/^(\d\d\/\d\d)(\d+)$/g,'$1/$2').replace(/[^\d\/]/g,'');
    this.individualApplicationForm.controls['dob'].setValue(dobVal);
  }

  nextStep() {
  }

  previousStep() {
  }

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

}
