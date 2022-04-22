import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { RequestService } from "src/app/services/request.service";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-header-stats",
  templateUrl: "./header-stats.component.html",
})

// TODO: change header stats for Dashboard to request information
export class HeaderStatsComponent implements OnInit {
  requests: any[];
  currentService: String;
  user: any[];
  isLoading = false;

  constructor(private http: HttpClient, private userService: UserService, private requestService: RequestService) {
  }

  ngOnInit(): void {
    this.user = this.userService.getUserData();
    this.currentService = this.userService.currentService;
    this.getRequests();
  }

  getRequests() {
    this.isLoading = true;
    let userType = this.user[0].role;
    let email = this.user[0].email;

    this.requestService.getRequests(userType, email).subscribe(
      res => {
        this.isLoading = false;
        this.requests = [res];
      },
      error => {
        this.isLoading = false;
        console.error('Error getting requests for user: ', error);
      }
    )
  }

  getTotalRequests() {
    return this.requests[0]?.requests.length;
  }

  getRequestsAccepted() {
    var submissions = this.requests[0]?.requests.filter(req => req.status === 'ACCEPTED');
    return submissions?.length;
  }

  getApplicationsScreened() {
    // history db count applications closed
  }
}
