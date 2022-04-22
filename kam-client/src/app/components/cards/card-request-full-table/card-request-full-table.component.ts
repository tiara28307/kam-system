import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DialogService } from '@ngneat/dialog';
import { RequestService } from 'src/app/services/request.service';
import { UserService } from 'src/app/services/user.service';
import { CardRequestOverviewComponent } from '../card-request-overview/card-request-overview.component';

@Component({
  selector: 'app-card-request-full-table',
  templateUrl: './card-request-full-table.component.html',
  styles: [
  ]
})
export class CardRequestFullTableComponent implements OnInit {
  isLoading = false;
  user: any[];
  requests = [];
  column2Name = '';
  currentService = '';

  constructor(
    private requestService: RequestService,
    private dialog: DialogService,
    private userService: UserService
  ) {
  }

  ngOnInit(): void {
    this.user = this.userService.getUserData();
    this.currentService = this.userService.currentService;
    this.getRequests();
    this.column2Name = this.currentService === 'KYC Onboarding' ? 'Sender' : 'Receiver'
  }

  getRequests() {
    this.isLoading = true;
    let userType = this.user[0].role;
    let email = this.user[0].email;

    this.requestService.getRequests(userType, email).subscribe(
      res => {
        this.isLoading = false;
        this.requests = [res];
        this.requests = this.requests[0].requests;
      },
      error => {
        this.isLoading = false;
        console.error('Error getting requests for user: ', error);
      }
    )
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

  openRequest(request) {
    this.requestService.currentReq.setReq(request);
    this.dialog.open(CardRequestOverviewComponent);
  }
}
