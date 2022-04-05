import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-header-stats",
  templateUrl: "./header-stats.component.html",
})

// TODO: change header stats for Dashboard to request information
export class HeaderStatsComponent implements OnInit {
  applications: any[];

  constructor(private http: HttpClient) {
    this.http.get('assets/json/applications.json').subscribe((res) => {
      this.applications = res as any[];
      // console.log('result :: ', this.applications);
    },
    (err: HttpErrorResponse) => {
      console.log(err.message);
    })
  }

  ngOnInit(): void {
  }

  getTotalApplications() {
    return this.applications.length;
  }

  getApplicationsSubmitted() {
    var submissions = this.applications.filter(app => app.status === 'SUBMITTED');
    return submissions.length;
  }

  getApplicationsApproved() {
    var approved = this.applications.filter(app => app.status === 'APPROVED');
    return approved.length;
  }
}
