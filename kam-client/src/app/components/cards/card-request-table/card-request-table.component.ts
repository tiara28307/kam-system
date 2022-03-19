import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-card-request-table',
  templateUrl: './card-request-table.component.html',
  styles: [
  ]
})
export class CardRequestTableComponent implements OnInit {
  requests: string[];

  constructor(private http: HttpClient) {
    this.http.get('assets/json/requests.json').subscribe((res) => {
      this.requests = res as string[];
      this.requests = this.requests.slice(0, 5);
      // console.log('result :: ', this.requests);
    },
    (err: HttpErrorResponse) => {
      console.log(err.message);
    })
  }

  ngOnInit(): void {
  }

  getStatusColor(status) {
    switch (status) {
      case 'ACCEPTED':
        return 'text-emerald-500';
      case 'REJECTED':
        return 'text-red-600';
      case 'UNDECIDED':
        return 'text-theme-500'
    }
  }

  getStatusBackgroundColor(status) {
    switch (status) {
      case 'ACCEPTED':
        return 'bg-emerald-200';
      case 'REJECTED':
        return 'bg-red-200';
      case 'UNDECIDED':
        return 'bg-sky-200'
    }
  }

}
