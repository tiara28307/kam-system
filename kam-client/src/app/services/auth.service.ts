import { Injectable } from '@angular/core';
import { CognitoUserPool } from 'amazon-cognito-identity-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }

  isAuthenticated(user: string): boolean {
    var isAuth = false;
    var isUser = false;
    var userType = '';

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
        userType = session.idToken.payload["custom:role"];
        isUser = userType === user;
        isAuth = session.isValid() && isUser;
      })
    }
    return isAuth;
  }
}
