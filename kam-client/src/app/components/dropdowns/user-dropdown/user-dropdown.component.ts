import { Component, AfterViewInit, ViewChild, ElementRef } from "@angular/core";
import { Router } from "@angular/router";
import { createPopper } from "@popperjs/core";
import { CognitoUserPool } from "amazon-cognito-identity-js";
import { UserService } from "src/app/services/user.service";
import { LogoutAlert } from "src/constants/alerts.constant";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-user-dropdown",
  templateUrl: "./user-dropdown.component.html",
  host: {
    "(window:click)": "closeDropdown()"
  }
})
export class UserDropdownComponent implements AfterViewInit {
  dropdownPopoverShow = false;
  @ViewChild("btnDropdownRef", { static: false }) btnDropdownRef: ElementRef;
  @ViewChild("popoverDropdownRef", { static: false })
  popoverDropdownRef: ElementRef;
  settingsLink: string;

  constructor(
    private router: Router,
    private userService: UserService
  ) {}

  ngAfterViewInit() {
    createPopper(
      this.btnDropdownRef.nativeElement,
      this.popoverDropdownRef.nativeElement,
      {
        placement: "bottom-start",
      }
    );
    this.setSettingsLink();
  }
  toggleDropdown(event) {
    event.preventDefault();
    if (this.dropdownPopoverShow) {
      this.dropdownPopoverShow = false;
    } else {
      this.dropdownPopoverShow = true;
    }
    event.stopPropagation();
  }

  setSettingsLink() {
    var user = this.userService.getUserData();
    var role = user[0].role;
    var customerSettingsLink = '/user/customer/settings';
    var companySettingsLink = '/user/company/settings';
    this.settingsLink = role === 'CUSTOMER' ? customerSettingsLink : companySettingsLink;
    console.log(this.settingsLink);
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
        if (result.isConfirmed === true) {
          this.logout();
        }
      });
  }

  closeDropdown() {
    if (this.dropdownPopoverShow) {
      this.dropdownPopoverShow = false;
    }
  }
}
