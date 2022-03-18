import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthenticationDetails, CognitoUser, CognitoUserPool } from "amazon-cognito-identity-js";
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
      // alert('Customer form submitted succesfully!');
      // console.table(this.loginForm.value);
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

      // cognitoUser.confirmRegistration()
      
      cognitoUser.authenticateUser(authDetails, {
        onSuccess: (result) => {
          this.router.navigate(['/user/dashboard']);
        },
        onFailure: (err) => {
          alert(err.message || JSON.stringify(err));
          this.isLoading = false;
        }
      });
    } else {
      console.log('Incorrect email or password');
    }
  }
}
