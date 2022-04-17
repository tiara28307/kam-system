import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
})
export class SidebarComponent implements OnInit {
  collapseShow = "hidden";
  user: any[];
  url: string;
  currentService: string;
  services = [
    'KYC Onboarding',
    'KYC Screening'
  ];

  constructor(
    private userService: UserService,
    private router: Router
    ) {}

  ngOnInit() {
    // Get current user information
    this.user = this.userService.getUserData();
    this.url = this.router.url;

    // Set sidebar based on current user type
    if (this.user[0].role === 'CUSTOMER') {
      this.userService.currentService = this.services[0];
      this.userService.settingsLink = '/user/customer/settings';
      console.log(this.userService.settingsLink)
    } else if (this.user[0].role === 'COMPANY') {
      this.userService.currentService = this.services[1];
      this.userService.settingsLink = '/user/company/settings';
    }
    this.currentService = this.userService.currentService;
  }

  toggleCollapseShow(classes) {
    this.collapseShow = classes;
  }
}
