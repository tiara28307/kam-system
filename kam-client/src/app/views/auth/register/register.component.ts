import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { CognitoUserAttribute, CognitoUserPool } from "amazon-cognito-identity-js";
import { RegisterValidationService } from "src/app/services/register-validation.service";
import { environment } from "src/environments/environment";
import { FailedRegistrationAlert, SuccessfulRegistrationAlert } from "src/constants/alerts.constant";
import { RegisterService } from "src/app/services/register.service";

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
  isLoading = false;
  companyTypes = [];
  countries = [];
  
  constructor(
    private formBuilder: FormBuilder,
    private registerValidator: RegisterValidationService,
    private router: Router,
    private registerService: RegisterService
  ) {}

  ngOnInit(): void {
    // Set select field data in registration form
    this.setCompanyTypes();
    this.setCountries();

    // Build customer registration form with input validation scheme
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
      customerPass: ['', Validators.compose([
        Validators.required,
        Validators.pattern(this.registerValidator.passwordPattern)
      ])],
      customerPassConfirm: ['', [Validators.required]],
      customerPolicy: ['', [Validators.required]]
    },
    {
      validators: this.registerValidator.checkCustomerPasswords
    }
    );

    // Build company registration form with input validation scheme
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
      companyState: ['', [Validators.required]],
      companyCountry: ['', [Validators.required]],
      companyPostal: ['', Validators.compose([
        Validators.required,
        Validators.pattern(this.registerValidator.postalCodePattern)
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
      employeePass: ['', Validators.compose([
        Validators.required,
        Validators.pattern(this.registerValidator.passwordPattern)
      ])],
      employeePassConfirm: ['', [Validators.required]],
      employeeJobTitle: ['', [Validators.required]],
      companyPolicy: ['', [Validators.required]]
    },
    {
      validators: this.registerValidator.checkEmployeePasswords
    }
    );
  }

  setCompanyTypes() {
    this.registerService.getCompanyTypes().subscribe(
      res => {
        this.companyTypes = [res];
        this.companyTypes = this.companyTypes[0].companyTypesMap
      },
      error => {
        console.error('Error with register service for company types: ', error);
      }
    );
  }

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

  onRegisterCustomerUser() {
    if (this.customerRegisterForm.valid) {
      this.isLoading = true;
      
      var poolData = {
        UserPoolId: environment.AWS_COGNITO_USER_POOL,
        ClientId: environment.AWS_COGNITO_CLIENT_ID
      };
      var userPool = new CognitoUserPool(poolData);
      var attributeList = [];

      // customer details
      let customerFirstName = this.customerRegisterForm.value.customerFirstName;
      let customerLastName = this.customerRegisterForm.value.customerLastName;
      let customerEmail = this.customerRegisterForm.value.customerEmail;
      let customerPhone = this.customerRegisterForm.value.customerPhone;
      let customerPass = this.customerRegisterForm.value.customerPass;
      
      let formData = {
        "name": customerFirstName,
        "family_name": customerLastName,
        "email": customerEmail,
        "custom:phone": customerPhone,
        "custom:role": 'CUSTOMER'
      }

      for (let key in formData) {
        let attrData = {
          Name: key,
          Value: formData[key]
        }
        let attribute = new CognitoUserAttribute(attrData);
        attributeList.push(attribute);
      }

      userPool.signUp(customerEmail, customerPass, attributeList, [], (
        err,
        result
      ) => {
        this.isLoading = false;
        if (err) {
          FailedRegistrationAlert(err).fire({});
          return;
        }

        console.log('Success Registration: ', result);
        SuccessfulRegistrationAlert.fire({})
          .then((result) => {
            this.router.navigate(['/auth/login']);
          });
      });
    } else {
      console.log('Invalid Input');
    }
  }

  onRegisterCompanyUser() {
    if (this.companyRegisterForm.valid) {
      this.isLoading = true;
      
      var poolData = {
        UserPoolId: environment.AWS_COGNITO_USER_POOL,
        ClientId: environment.AWS_COGNITO_CLIENT_ID
      };
      var userPool = new CognitoUserPool(poolData);
      var attributeList = [];

      // company details
      let companyName = this.companyRegisterForm.value.companyName;
      let companyPhone = this.companyRegisterForm.value.companyPhone;
      let companyType = this.companyRegisterForm.value.companyType;
      let companyWebsite = this.companyRegisterForm.value.companyWebsite;
      let companyAddress = this.companyRegisterForm.value.companyAddress;
      let companyCity = this.companyRegisterForm.value.companyCity;
      let companyState = this.companyRegisterForm.value.companyState;
      let companyCountry = this.companyRegisterForm.value.companyCountry;
      let companyPostal = this.companyRegisterForm.value.companyPostal;

      // employee details
      let employeeFirstName = this.companyRegisterForm.value.employeeFirstName;
      let employeeLastName = this.companyRegisterForm.value.employeeLastName;
      let employeeEmail = this.companyRegisterForm.value.employeeEmail;
      let employeePhone = this.companyRegisterForm.value.employeePhone;
      let employeePass = this.companyRegisterForm.value.employeePass;
      let employeeJobTitle = this.companyRegisterForm.value.employeeJobTitle;
      
      let formData = {
        "name": employeeFirstName,
        "family_name": employeeLastName,
        "email": employeeEmail,
        "custom:phone": employeePhone, 
        "custom:job_title": employeeJobTitle,
        "custom:role": 'COMPANY',
        "custom:company_name": companyName,
        "custom:company_phone": companyPhone,
        "custom:company_type": companyType,
        "website": companyWebsite,
        "address": companyAddress,
        "custom:city": companyCity,
        "custom:state": companyState,
        "custom:country": companyCountry,
        "custom:postal_code": companyPostal
      }

      for (let key in formData) {
        let attrData = {
          Name: key,
          Value: formData[key]
        }
        let attribute = new CognitoUserAttribute(attrData);
        attributeList.push(attribute);
      }

      userPool.signUp(employeeEmail, employeePass, attributeList, [], (
        err,
        result
      ) => {
        this.isLoading = false;
        if (err) {
          FailedRegistrationAlert(err).fire({});
          return;
        }

        console.log('Success Registration: ', result);
        SuccessfulRegistrationAlert.fire({})
          .then((result) => {
            this.router.navigate(['/auth/login']);
          });
      });
    } else {
      console.log('Invalid Input');
    }
  }

}
