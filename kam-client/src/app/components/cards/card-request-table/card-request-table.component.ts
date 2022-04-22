import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { RequestService } from 'src/app/services/request.service';
import { DialogService } from '@ngneat/dialog';
import { CardRequestOverviewComponent } from '../card-request-overview/card-request-overview.component';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-card-request-table',
  templateUrl: './card-request-table.component.html',
  styles: [
  ]
})
export class CardRequestTableComponent implements OnInit {
  isLoading = false;
  user: any[];
  requests = [];

  constructor(
    private requestService: RequestService,
    private dialog: DialogService,
    private userService: UserService
  ) {
  }

  ngOnInit(): void {
    this.user = this.userService.getUserData();
    this.getRequests();
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
    this.requestService.req = request;
    this.dialog.open(CardRequestOverviewComponent);
  }
}
