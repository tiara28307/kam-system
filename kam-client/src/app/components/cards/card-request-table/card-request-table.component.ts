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
    this.getRequest();
  }

  ngOnInit(): void {
  }

  getRequest() {
    this.http.get('assets/json/requests.json').subscribe((res) => {
      this.requests = res as string[];
    },
    (err: HttpErrorResponse) => {
      console.log(err.message);
    })
  }

  getStatusColor(status) {
    switch (status) {
      case 'ACCEPTED':
        return 'text-emerald-500';
      case 'REJECTED':
        return 'text-red-600';
      case 'UNDECIDED':
        return 'text-sky-600'
    }
  }
}
