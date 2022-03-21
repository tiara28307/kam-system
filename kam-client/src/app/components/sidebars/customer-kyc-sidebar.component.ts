import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-customer-kyc-sidebar",
  templateUrl: "./customer-kyc-sidebar.component.html",
})
export class CustomerKycSidebarComponent implements OnInit {
  collapseShow = "hidden";
  constructor() {}

  ngOnInit() {}
  toggleCollapseShow(classes) {
    this.collapseShow = classes;
  }
}
