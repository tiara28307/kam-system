import { Injectable } from '@angular/core';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private userService: UserService
  ) { }

  // Check user authentication before gaining access to services in KAM
  isAuthenticated(user: string): boolean {
    var isAuth = false;
    var isUser = false;
    var userType = '';

    let cognitoUser = this.userService.getAuthenticatedUser();

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
