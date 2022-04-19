import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CognitoUser, CognitoUserPool } from 'amazon-cognito-identity-js';
import { EnterNewPasswordAlert, EnterVerificationCodeAlert, FailedChangePasswordAlert, FailedResetPasswordAlert, FailedUpdateAttributesAlert, SuccessfulAtrributesUpdateAlert, SuccessfulPasswordChangeAlert, SuccessfulPasswordResetAlert } from 'src/constants/alerts.constant';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _currentService: string;
  private _settingsLink: string;

  constructor(
    private router: Router
  ) {}

  set currentService(val: string) {
    this._currentService = val;
  }

  get currentService(): string {
    return this._currentService;
  }

  set settingsLink(link: string) {
    this._settingsLink = link;
  }

  get settingsLink(): string {
    return this._settingsLink;
  }

  getAuthenticatedUser = () => {
    let userPool = new CognitoUserPool({
        UserPoolId: environment.AWS_COGNITO_USER_POOL,
        ClientId: environment.AWS_COGNITO_CLIENT_ID
    });
    return userPool.getCurrentUser();
  };

  // Based on current user type return user data from AWS Cognito
  getUserData(): any[] {
    var user: any[];

    let poolData = {
      UserPoolId: environment.AWS_COGNITO_USER_POOL,
      ClientId: environment.AWS_COGNITO_CLIENT_ID
    };

    var userPool = new CognitoUserPool(poolData);
    var cognitoUser = userPool.getCurrentUser();

    if (cognitoUser != null) {
      cognitoUser.getSession((err: any, session: any) => {
        if (err) {
          alert(err.message || JSON.stringify(err));
        }
        cognitoUser.getUserData((err: any, res: any) => {
          if (err) {
            alert(err.message || JSON.stringify(err));
          }
          var userData = res.UserAttributes;
          var userType = userData.filter(attr => attr.Name === 'custom:role')[0].Value;

          if (userType === 'CUSTOMER') {
            user = [{
              username: userData.filter(attr => attr.Name === 'sub')[0].Value,
              email: userData.filter(attr => attr.Name === 'email')[0].Value,
              firstName: userData.filter(attr => attr.Name === 'name')[0].Value,
              lastName: userData.filter(attr => attr.Name === 'family_name')[0].Value,
              phone: userData.filter(attr => attr.Name === 'custom:phone')[0].Value,
              role: userData.filter(attr => attr.Name === 'custom:role')[0].Value
            }];
          } else if (userType === 'COMPANY') {
            user = [{
              username: userData.filter(attr => attr.Name === 'sub')[0].Value,
              email: userData.filter(attr => attr.Name === 'email')[0].Value,
              firstName: userData.filter(attr => attr.Name === 'name')[0].Value,
              lastName: userData.filter(attr => attr.Name === 'family_name')[0].Value,
              phone: userData.filter(attr => attr.Name === 'custom:phone')[0].Value,
              jobTitle: userData.filter(attr => attr.Name === 'custom:job_title')[0].Value,
              role: userData.filter(attr => attr.Name === 'custom:role')[0].Value,
              companyName: userData.filter(attr => attr.Name === 'custom:company_name')[0].Value,
              companyPhone: userData.filter(attr => attr.Name === 'custom:company_phone')[0].Value,
              companyType: userData.filter(attr => attr.Name === 'custom:company_type')[0].Value,
              website: userData.filter(attr => attr.Name === 'website')[0].Value,
              address: userData.filter(attr => attr.Name === 'address')[0].Value,
              city: userData.filter(attr => attr.Name === 'custom:city')[0].Value,
              state: userData.filter(attr => attr.Name === 'custom:state')[0].Value,
              country: userData.filter(attr => attr.Name === 'custom:country')[0].Value,
              postal: userData.filter(attr => attr.Name === 'custom:postal_code')[0].Value
            }];
          }
        })
      })
    }
    return user;
  }

  logoutUser() {
    let cognitoUser = this.getAuthenticatedUser();
    cognitoUser?.signOut();
    this.router.navigate(['/']);
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
            if (result === 'SUCCESS') {
              return SuccessfulPasswordResetAlert.fire({});
            }
          },
          onFailure: (err) => {
            return FailedResetPasswordAlert(err).fire({});
          }
        });
      }
    });
    cognitoUser?.signOut();
  }

  updateAttributes(attributeList) {
    let cognitoUser = this.getAuthenticatedUser();
    
    if (cognitoUser != null) {
      cognitoUser.getSession((err: any, session: any) => {
        if (err) {
          alert(err.message || JSON.stringify(err));
        }
        cognitoUser.updateAttributes(attributeList, (err, result) => {
          if (err) {
            FailedUpdateAttributesAlert(err).fire({});
          }
          console.log('update result: ' + result);
          SuccessfulAtrributesUpdateAlert.fire({});
        })
      })
    }
  }

}
