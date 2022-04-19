import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-header-stats",
  templateUrl: "./header-stats.component.html",
})

// TODO: change header stats for Dashboard to request information
export class HeaderStatsComponent implements OnInit {
  applications: any[];
  currentService: String;

  constructor(private http: HttpClient, private userService: UserService) {
    this.http.get('assets/json/applications.json').subscribe((res) => {
      this.applications = res as any[];
    },
    (err: HttpErrorResponse) => {
      console.log(err.message);
    })
  }

  ngOnInit(): void {
    this.currentService = this.userService.currentService;
  }

  getTotalApplications() {
    return this.applications?.length;
  }

  getApplicationsSubmitted() {
    var submissions = this.applications?.filter(app => app.status === 'SUBMITTED');
    return submissions?.length;
  }

  getApplicationsApproved() {
    var approved = this.applications?.filter(app => app.status === 'APPROVED');
    return approved?.length;
  }
}
