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
    this.user = this.userService.getUserData();
    this.url = this.router.url;

    if (this.user[0].role === 'CUSTOMER') {
      this.userService.currentService = this.services[0];
    } else if (this.user[0].role === 'COMPANY') {
        this.userService.currentService = this.services[1];
    }
    this.currentService = this.userService.currentService;
  }
  toggleCollapseShow(classes) {
    this.collapseShow = classes;
  }
}
