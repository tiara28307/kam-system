import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService } from '@ngneat/dialog';
import { RequestService } from 'src/app/services/kyc/request.service';
import { CardRequestOverviewComponent } from '../card-request-overview/card-request-overview.component';

@Component({
  selector: 'app-card-request-full-table',
  templateUrl: './card-request-full-table.component.html',
  styles: [
  ]
})
export class CardRequestFullTableComponent implements OnInit {
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

  openRequest(id, status) {
    this.requestService.requestId = id;
    this.requestService.status = status;
    this.dialog.open(CardRequestOverviewComponent);
  }
}
