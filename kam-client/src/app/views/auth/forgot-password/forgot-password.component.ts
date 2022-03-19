import { Component, OnInit } from '@angular/core';
import { CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import { EnterNewPasswordAlert, EnterVerificationCodeAlert, FailedResetPasswordAlert, SuccessfulPasswordResetAlert } from 'src/constants/alerts.constant';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styles: [
  ]
})
export class ForgotPasswordComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  resetPassword(username) {
    let poolData = {
      UserPoolId: environment.AWS_COGNITO_USER_POOL,
      ClientId: environment.AWS_COGNITO_CLIENT_ID
    };
    var userPool = new CognitoUserPool(poolData);
    let userData = {
      Username: username,
      Pool: userPool
    };
    var cognitoUser = new CognitoUser(userData);

    cognitoUser.forgotPassword({
      onSuccess: (result) => {
        console.log('forget password call: ', result);
      },
      onFailure: (err) => {
        FailedResetPasswordAlert(err).fire({});
      },
      async inputVerificationCode() {
        var { value: verificationCode } = await EnterVerificationCodeAlert.fire({});
        var { value: newPassword } = await EnterNewPasswordAlert.fire({});
        cognitoUser.confirmPassword(verificationCode, newPassword, {
          onSuccess: (result) => {
            console.log('password reset: ', result);
            return SuccessfulPasswordResetAlert.fire({})
              .then((result) => {
                this.router.navigate(['/auth/login']);
              });
          },
          onFailure: (err) => {
            return FailedResetPasswordAlert(err).fire({});
          }
        });
      }
    });
  }

  onSubmit(username) {
    this.resetPassword(username);
  }

}
