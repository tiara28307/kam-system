import { Component, OnInit } from "@angular/core";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
})
export class RegisterComponent implements OnInit {
  privacyPolicy = environment.privacyPolicyUrl;
  isCustomer = true;
  isCompany = false;
  
  constructor() {}

  ngOnInit(): void {}

  toggleIsCustomer(event) {
    event.preventDefault();
    if (this.isCustomer === false) {
      this.isCustomer = !this.isCustomer
    }
    this.isCompany = false;
    console.log("Is Customer User!");
  }

  toggleIsCompany(event) {
    event.preventDefault();
    if (this.isCompany === false) {
      this.isCompany = !this.isCompany;
    }
    this.isCustomer = false;
    console.log("Is Company User!");
  }
}
