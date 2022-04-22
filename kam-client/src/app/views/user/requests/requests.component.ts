import { Component, OnInit } from '@angular/core';
import { DialogService } from '@ngneat/dialog';
import { CardCreateRequestComponent } from 'src/app/components/cards/card-create-request/card-create-request.component';
import { RequestService } from 'src/app/services/request.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styles: [
  ]
})
export class RequestsComponent implements OnInit {
  currentService: String;

  constructor(
    private dialog: DialogService,
    private userService: UserService,
    private requestService: RequestService
  ) { }

  ngOnInit(): void {
    this.currentService = this.userService.currentService;
  }

  onCreateRequest() {
    this.dialog.open(CardCreateRequestComponent);
  }

}
