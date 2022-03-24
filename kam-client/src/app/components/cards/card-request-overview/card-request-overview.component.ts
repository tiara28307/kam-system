import { Component, OnInit } from '@angular/core';
import { DialogService, DialogRef } from '@ngneat/dialog';
import { RequestService } from 'src/app/services/request.service';

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

  constructor(
    public ref: DialogRef,
    private requestService: RequestService
  ) { }

  ngOnInit(): void {
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
      case 'UNDECIDED':
        return 'text-sky-600'
    }
  }

  checkStatus() {
    this.isDecided = (this.status === 'ACCEPTED' || this.status === 'REJECTED') ? true : false;
  }

  onAccept() {
    this.requestService.acceptedRequest();
  }

  onReject() {
    this.requestService.rejectedRequest();
  }

}
