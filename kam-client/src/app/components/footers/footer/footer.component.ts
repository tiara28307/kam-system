import { Component, OnInit } from "@angular/core";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
})
export class FooterComponent implements OnInit {
  date = new Date().getFullYear();
  termsAndConditions = environment.termsAndConditionsUrl;
  whitePaper = environment.whitePaper;

  constructor() {}

  ngOnInit(): void {}
}
