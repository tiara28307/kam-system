import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DialogRef } from '@ngneat/dialog';
import { RequestService } from 'src/app/services/request.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-card-request-overview',
  templateUrl: './card-request-overview.component.html',
  styles: [
  ]
})
export class CardRequestOverviewComponent implements OnInit {
  requestId: string;
  status: string;
  isDecided = false;
  isAccepted = false;
  currentService: String;

  constructor(
    public ref: DialogRef,
    private requestService: RequestService,
    private userSerive: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.currentService = this.userSerive.currentService;
    this.requestId = this.requestService.requestId;
    this.status = this.requestService.status;
    this.checkStatus();
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

  checkStatus() {
    this.isDecided = (this.status === 'ACCEPTED' || this.status === 'REJECTED');
    this.isAccepted = this.status === 'ACCEPTED';
  }

  onAccept() {
    this.requestService.acceptedRequest();
  }

  onReject() {
    this.requestService.rejectedRequest();
  }

  openApplication(applicationId) {
    this.router.navigate(['/user/kyc/screening/application', applicationId]);
    this.ref.close();
  }

}
