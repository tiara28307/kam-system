import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthenticationDetails, CognitoUser, CognitoUserPool } from "amazon-cognito-identity-js";
import { FailedLoginAlert } from "src/constants/alerts.constant";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.email
      ])],
      password: ['', Validators.required]
      // rememberMe: ['']
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      let email = this.loginForm.value.email;
      let password = this.loginForm.value.password;

      let authDetails = new AuthenticationDetails({
        Username: email,
        Password: password
      });
      let poolData = {
        UserPoolId: environment.AWS_COGNITO_USER_POOL,
        ClientId: environment.AWS_COGNITO_CLIENT_ID
      };

      var userPool = new CognitoUserPool(poolData);
      let userData = {
        Username: email,
        Pool: userPool
      };
      var cognitoUser = new CognitoUser(userData);
      
      cognitoUser.authenticateUser(authDetails, {
        onSuccess: (result) => {
          console.log('Logged In');
          var userType = this.getUserType(result);
          this.isLoading = false;
          
          if (userType === 'CUSTOMER') {
            this.router.navigate(['/user/kyc/onboarding/dashboard']);
          } else if (userType === 'COMPANY') {
            this.router.navigate(['/select/service']);
          }
        },
        onFailure: (err) => {
          this.isLoading = false;
          FailedLoginAlert(err).fire({});
        }
      });
    } else {
      console.log('Incorrect email or password');
    }
  }
}
