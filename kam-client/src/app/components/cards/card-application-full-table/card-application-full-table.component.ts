import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-application-full-table',
  templateUrl: './card-application-full-table.component.html',
  styles: [
  ]
})
export class CardApplicationFullTableComponent implements OnInit {
  applications: string[];

  constructor(private http: HttpClient) {
    this.http.get('assets/json/applications.json').subscribe((res) => {
      this.applications = res as string[];
      console.log('result :: ', this.applications);
    },
    (err: HttpErrorResponse) => {
      console.log(err.message);
    })
  }

  ngOnInit(): void {
  }

  getStatusColor(status) {
    switch (status) {
      case 'APPROVED':
        return 'text-emerald-500';
      case 'SUBMITTED':
        return 'text-orange-500';
      case 'REJECTED':
        return 'text-red-600';
      case 'OPEN':
        return 'text-theme-500'
    }
  }

  getStatusBackgroundColor(status) {
    switch (status) {
      case 'APPROVED':
        return 'bg-emerald-200';
      case 'SUBMITTED':
        return 'bg-orange-200';
      case 'REJECTED':
        return 'bg-red-200';
      case 'OPEN':
        return 'bg-sky-200'
    }
  }

}
