import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { RegisterValidationService } from "src/app/services/register-validation.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
})
export class RegisterComponent implements OnInit {
  privacyPolicy = environment.privacyPolicyUrl;
  isCustomer = false;
  isCompany = false;
  customerRegisterForm: FormGroup;
  companyRegisterForm: FormGroup;
  
  constructor(
    private formBuilder: FormBuilder,
    private registerValidator: RegisterValidationService
  ) {}

  ngOnInit(): void {
    // TODO: Add input validation schema

    // TODO: Disable Create new account button until valid input

    this.customerRegisterForm = this.formBuilder.group({
      customerFirstName: ['', [Validators.required]],
      customerLastName: ['', [Validators.required]],
      customerEmail: ['', Validators.compose([
        Validators.required,
        Validators.email
      ])],
      customerPhone: ['', Validators.compose([
        Validators.pattern(this.registerValidator.phonePattern)
      ])],
      customerPass: ['', [Validators.required]],
      customerPassConfirm: ['', [Validators.required]],
      customerPolicy: ['', [Validators.required]]
    },
    {
      validators: this.registerValidator.checkCustomerPasswords
    }
    );

    this.companyRegisterForm = this.formBuilder.group({
      companyName: ['', [Validators.required]],
      companyPhone: ['', Validators.compose([
        Validators.pattern(this.registerValidator.phonePattern)
      ])],
      companyType: ['', [Validators.required]],
      companyWebsite: ['', Validators.compose([
        Validators.pattern(this.registerValidator.urlPattern)
      ])],
      companyAddress: ['', [Validators.required]],
      companyCity: ['', [Validators.required]],
      companyCountry: ['', [Validators.required]],
      companyPostal: ['', Validators.compose([
        Validators.required,
        Validators.pattern(this.registerValidator.postalCode)
      ])],
      employeeFirstName: ['', [Validators.required]],
      employeeLastName: ['', [Validators.required]],
      employeeEmail: ['', Validators.compose([
        Validators.required,
        Validators.email
      ])],
      employeePhone: ['', Validators.compose([
        Validators.pattern(this.registerValidator.phonePattern)
      ])],
      employeePass: ['', [Validators.required]],
      employeePassConfirm: ['', [Validators.required]],
      employeeJobTitle: ['', [Validators.required]],
      companyPolicy: ['', [Validators.required]]
    },
    {
      validators: this.registerValidator.checkEmployeePasswords
    }
    );
  }

  // Add some validation checker that enables and disables create new account button
  // based on proper input values

  toggleIsCustomer(event) {
    event.preventDefault();
    if (this.isCustomer === false) {
      this.isCustomer = !this.isCustomer
    }
    this.isCompany = false;
    console.log("Is Customer User!");
  }

  toggleIsCompany(event) {
    event.preventDefault();
    if (this.isCompany === false) {
      this.isCompany = !this.isCompany;
    }
    this.isCustomer = false;
    console.log("Is Company User!");
  }

  registerCustomerUser() {
    // Connect to AWS Cognito
    // Check if user already exists
    // If exists return 'user already exists' error message suggest logging in
    // If does not exist register new user
    if (this.customerRegisterForm.valid) {
      alert('Form Submitted succesfully!!!\n Check the values in browser console.');
      console.table(this.customerRegisterForm.value);
    } else {
      console.log('Invalid Input');
    }
  }

  registerCompanyUser() {
    // Connect to AWS Cognito
    // Check if user already exists
    // If exists return 'user already exists' error message suggest logging in
    // If does not exist register new user
    console.log('Company: ', this.companyRegisterForm);
  }
}
