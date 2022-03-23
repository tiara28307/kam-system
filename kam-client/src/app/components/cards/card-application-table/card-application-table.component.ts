import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-card-application-table",
  templateUrl: "./card-application-table.component.html",
})
export class CardApplicationTableComponent implements OnInit {
  applications: string[];

  constructor(private http: HttpClient) {
    this.getApplications();
  }

  ngOnInit(): void {
  }

  getApplications() {
    this.http.get('assets/json/applications.json').subscribe((res) => {
      this.applications = res as string[];
      this.applications = this.applications.slice(0, 5);
    },
    (err: HttpErrorResponse) => {
      console.log(err.message);
    })
  }

  getStatusColor(status) {
    switch (status) {
      case 'APPROVED':
        return 'text-emerald-600';
      case 'SUBMITTED':
        return 'text-orange-500';
      case 'REJECTED':
        return 'text-red-600';
      case 'OPEN':
        return 'text-sky-600'
    }
  }
}
