import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import { EnterNewPasswordAlert, EnterVerificationCodeAlert, FailedResetPasswordAlert, SuccessfulPasswordResetAlert } from 'src/constants/alerts.constant';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styles: [
  ]
})
export class ForgotPasswordComponent implements OnInit {

  constructor(private location: Location, private userService: UserService) { }

  ngOnInit(): void {
  }

  onSubmit(username) {
    this.userService.resetPassword(username);
  }

  goBack() {
    this.location.back();
  }

}
