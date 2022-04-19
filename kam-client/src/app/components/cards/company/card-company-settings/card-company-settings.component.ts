import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CognitoUserAttribute } from 'amazon-cognito-identity-js';
import { RegisterValidationService } from 'src/app/services/register-validation.service';
import { RegisterService } from 'src/app/services/register.service';
import { UserService } from 'src/app/services/user.service';
import { ChangePasswordAlert } from 'src/constants/alerts.constant';

@Component({
  selector: 'app-card-company-settings',
  templateUrl: './card-company-settings.component.html',
  styles: [
  ]
})
export class CardCompanySettingsComponent implements OnInit {
  user: any[];
  companyTypes = [];
  countries = [];
  companySettingsForm: FormGroup;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private registerValidator: RegisterValidationService,
    private registerService: RegisterService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.user = this.userService.getUserData();
    this.setCompanyTypes();
    this.setCountries();

    this.companySettingsForm = this.formBuilder.group({
      companyName: [this.user[0].companyName, [Validators.required]],
      companyPhone: [this.user[0].companyPhone, Validators.compose([
        Validators.required,
        Validators.pattern(this.registerValidator.phonePattern)
      ])],
      companyType: [this.user[0].companyType, [Validators.required]],
      website: [this.user[0].website, [Validators.required]],
      address: [this.user[0].address, [Validators.required]],
      city: [this.user[0].city, [Validators.required]],
      state: [this.user[0].state, [Validators.required]],
      postalCode: [this.user[0].postal, [Validators.required]],
      country: [this.user[0].country, [Validators.required]],
      empFirstName: [this.user[0].firstName, [Validators.required]],
      empLastName: [this.user[0].lastName, [Validators.required]],
      jobTitle: [this.user[0].jobTitle, [Validators.required]],
      empPhone: [this.user[0].phone, Validators.compose([
        Validators.required,
        Validators.pattern(this.registerValidator.phonePattern)
      ])],
      empEmail: [this.user[0].email, Validators.compose([
        Validators.required,
        Validators.email
      ])]
    });
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

  updateUserDetails() {
    let form = this.companySettingsForm.controls;
    var attributeList = [];

    let updateCompanyName = form.companyName.value != this.user[0].companyName;
    let updateCompanyPhone = form.companyPhone.value != this.user[0].companyPhone;
    let updatedCompanyType = form.companyType.value != this.user[0].companyType;
    let updatedWebsite = form.website.value != this.user[0].website;
    let updatedAddress = form.address.value != this.user[0].address;
    let updatedCity = form.city.value != this.user[0].city;
    let updatedState = form.state.value != this.user[0].state;
    let updatedPostalCode = form.postalCode.value != this.user[0].postal;
    let updatedCountry = form.country.value != this.user[0].country;
    let updatedEmpFirstName = form.empFirstName.value != this.user[0].firstName;
    let updatedEmpLastName = form.empLastName.value != this.user[0].lastName;
    let updatedJobTitle = form.jobTitle.value != this.user[0].jobTitle;
    let updatedEmpPhone = form.empPhone.value != this.user[0].phone;
    let updatedEmpEmail = form.empEmail.value != this.user[0].email;

    var companyNameAttr = { Name: 'custom:company_name', Value: form.companyName.value };
    var companyPhoneAttr = { Name: 'custom:company_phone', Value: form.companyPhone.value };
    var companyTypeAttr = { Name: 'custom:company_type', Value: form.companyType.value };
    var websiteAttr = { Name: 'website', Value: form.website.value };
    var addressAttr = { Name: 'address', Value: form.address.value };
    var cityAttr = { Name: 'custom:city', Value: form.city.value };
    var stateAttr = { Name: 'custom:state', Value: form.state.value };
    var postalCodeAttr = { Name: 'custom:postal_code', Value: form.postalCode.value };
    var countryAttr = { Name: 'custom:country', Value: form.country.value };
    var empFirstNameAttr = { Name: 'name', Value: form.empFirstName.value };
    var empLastNameAttr = { Name: 'family_name', Value: form.empLastName.value };
    var jobTitleAttr = { Name: 'custom:job_title', Value: form.jobTitle.value };
    var empEmailAttr = { Name: 'email', Value: form.empEmail.value };
    var empPhoneAttr = { Name: 'custom:phone', Value: form.empPhone.value };

    var attributes = [
      { isUpdated: updateCompanyName, attr: companyNameAttr },
      { isUpdated: updateCompanyPhone, attr: companyPhoneAttr },
      { isUpdated: updatedCompanyType, attr: companyTypeAttr },
      { isUpdated: updatedWebsite, attr: websiteAttr },
      { isUpdated: updatedAddress, attr: addressAttr },
      { isUpdated: updatedCity, attr: cityAttr },
      { isUpdated: updatedState, attr: stateAttr },
      { isUpdated: updatedPostalCode, attr: postalCodeAttr },
      { isUpdated: updatedCountry, attr: countryAttr },
      { isUpdated: updatedEmpFirstName, attr: empFirstNameAttr },
      { isUpdated: updatedEmpLastName, attr: empLastNameAttr },
      { isUpdated: updatedJobTitle, attr: jobTitleAttr },
      { isUpdated: updatedEmpEmail, attr: empEmailAttr },
      { isUpdated: updatedEmpPhone, attr: empPhoneAttr }
    ];

    attributes.forEach(a => {
      if (a.isUpdated) {
        var attribute = new CognitoUserAttribute(a.attr);
        attributeList.push(attribute);
      }
    });

    this.userService.updateAttributes(attributeList);
  }

  onUpdate() {
    this.updateUserDetails();
  }

  onChangePassword() {
    ChangePasswordAlert.fire({})
      .then((result) => {
        if (result.isConfirmed === true) {
          this.router.navigate(['/auth/changepassword']);  
        }
      });
  }

}
