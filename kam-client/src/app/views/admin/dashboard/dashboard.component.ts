import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CognitoUserPool } from "amazon-cognito-identity-js";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
})
export class DashboardComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {}

  onLogout(): void {
    let poolData = {
      UserPoolId: environment.AWS_COGNITO_USER_POOL,
      ClientId: environment.AWS_COGNITO_CLIENT_ID
    };
    let userPool = new CognitoUserPool(poolData);
    let cognitoUser = userPool.getCurrentUser();
    cognitoUser?.signOut();
    this.router.navigate['/auth/login']
  }
}
