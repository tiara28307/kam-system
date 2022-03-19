import { Component, AfterViewInit, ViewChild, ElementRef } from "@angular/core";
import { Router } from "@angular/router";
import { createPopper } from "@popperjs/core";
import { CognitoUserPool } from "amazon-cognito-identity-js";
import { LogoutAlert } from "src/constants/alerts.constant";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-user-dropdown",
  templateUrl: "./user-dropdown.component.html",
})
export class UserDropdownComponent implements AfterViewInit {
  dropdownPopoverShow = false;
  @ViewChild("btnDropdownRef", { static: false }) btnDropdownRef: ElementRef;
  @ViewChild("popoverDropdownRef", { static: false })
  popoverDropdownRef: ElementRef;

  constructor(private router: Router) {}

  ngAfterViewInit() {
    createPopper(
      this.btnDropdownRef.nativeElement,
      this.popoverDropdownRef.nativeElement,
      {
        placement: "bottom-start",
      }
    );
  }
  toggleDropdown(event) {
    event.preventDefault();
    if (this.dropdownPopoverShow) {
      this.dropdownPopoverShow = false;
    } else {
      this.dropdownPopoverShow = true;
    }
  }

  logout() {
    let poolData = {
      UserPoolId: environment.AWS_COGNITO_USER_POOL,
      ClientId: environment.AWS_COGNITO_CLIENT_ID
    };
    let userPool = new CognitoUserPool(poolData);
    let cognitoUser = userPool.getCurrentUser();
    cognitoUser?.signOut();
    this.router.navigate(['/']);
  }

  onLogout(): void {
    LogoutAlert.fire({})
      .then((result) => {
        this.logout();
      });
  }
}
