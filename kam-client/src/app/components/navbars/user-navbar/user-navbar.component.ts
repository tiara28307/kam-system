import { Component, OnInit } from "@angular/core";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-user-navbar",
  templateUrl: "./user-navbar.component.html",
})
export class UserNavbarComponent implements OnInit {
  title: string;
  
  constructor(
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.title = this.userService.currentService;
  }
}
