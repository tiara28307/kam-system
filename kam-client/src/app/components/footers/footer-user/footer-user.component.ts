import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-footer-user",
  templateUrl: "./footer-user.component.html",
})
export class FooterUserComponent implements OnInit {
  date = new Date().getFullYear();
  constructor() {}

  ngOnInit(): void {}
}
