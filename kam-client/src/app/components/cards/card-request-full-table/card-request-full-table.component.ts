import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-request-full-table',
  templateUrl: './card-request-full-table.component.html',
  styles: [
  ]
})
export class CardRequestFullTableComponent implements OnInit {
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

  openRequest(id) {
    console.log('popup view for request: ', id);
  }
}
