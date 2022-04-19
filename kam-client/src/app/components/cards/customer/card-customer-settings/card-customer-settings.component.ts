import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from 'src/app/services/user.service';
import { RegisterValidationService } from "src/app/services/register-validation.service";
import { ChangePasswordAlert, EnterNewPasswordAlert, EnterVerificationCodeAlert, FailedChangePasswordAlert, FailedUpdateAttributesAlert, SuccessfulAtrributesUpdateAlert, SuccessfulPasswordChangeAlert } from 'src/constants/alerts.constant';
import { environment } from "src/environments/environment";
import { CognitoUser, CognitoUserAttribute, CognitoUserPool } from 'amazon-cognito-identity-js';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card-customer-settings',
  templateUrl: './card-customer-settings.component.html',
  styles: [
  ]
})
export class CardCustomerSettingsComponent implements OnInit {
  user: any[];
  customerSettingsForm: FormGroup;

  constructor(
    private userService: UserService,
    private formBuilder: FormBuilder,
    private registerValidator: RegisterValidationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.userService.getUserData();
    this.customerSettingsForm = this.formBuilder.group({
      firstName: [this.user[0].firstName, [Validators.required]],
      lastName: [this.user[0].lastName, [Validators.required]],
      phone: [this.user[0].phone, Validators.compose([
        Validators.required,
        Validators.pattern(this.registerValidator.phonePattern)
      ])],
      email: [this.user[0].email, Validators.compose([
        Validators.required,
        Validators.email
      ])]
    });
  }

  updateUserDetails() {
    let form = this.customerSettingsForm.controls;
    var attributeList = [];

    let updateFirstName = form.firstName.value != this.user[0].firstName;
    let updateLastName = form.lastName.value != this.user[0].lastName;
    let updateEmail = form.email.value != this.user[0].email;
    let updatePhone = form.phone.value != this.user[0].phone;

    var firstNameAttr = { Name: 'name', Value: form.firstName.value };
    var lastNameAttr = { Name: 'family_name', Value: form.lastName.value };
    var emailAttr = { Name: 'email', Value: form.email.value };
    var phoneAttr = { Name: 'custom:phone', Value: form.phone.value };

    var attributes = [
      { isUpdated: updateFirstName, attr: firstNameAttr },
      { isUpdated: updateLastName, attr: lastNameAttr },
      { isUpdated: updateEmail, attr: emailAttr },
      { isUpdated: updatePhone, attr: phoneAttr }
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
