import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DialogService } from '@ngneat/dialog';
import { RequestService } from 'src/app/services/request.service';

@Component({
  selector: 'app-card-history',
  templateUrl: './card-history.component.html',
  styles: [
  ]
})
export class CardHistoryComponent implements OnInit {
  requests: string[];

  constructor(
    private http: HttpClient, 
    private requestService: RequestService,
    private dialog: DialogService
  ) {
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
      case 'PENDING':
        return 'text-sky-600'
    }
  }

  openApplication(id, decision) {
    // View application risk assessment summary and decision made
  }

}
