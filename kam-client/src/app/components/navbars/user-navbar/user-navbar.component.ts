import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-user-navbar",
  templateUrl: "./user-navbar.component.html",
})
export class UserNavbarComponent implements OnInit {
  title: string;
  user: any[];
  url: string;
  services = [
    'KYC Onboarding',
    'KYC Screening',
    'AML Transaction Monitoring',
    'Case Management'
  ];
  
  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.user = this.userService.getUserData();
    this.url = this.router.url;

    if (this.user[0].role === 'CUSTOMER') {
      this.title = this.services[0];
    } else if (this.user[0].role === 'COMPANY') {
      if (this.url.includes('kyc/screening')) {
        this.title = this.services[1];
      } else if (this.url.includes('aml')) {
        this.title = this.services[2];
      } else if (this.url.includes('casemanagement')) {
        this.title = this.services[3];
      }
    }
  }
}
