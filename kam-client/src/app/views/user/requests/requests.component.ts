import { Component, OnInit } from '@angular/core';
import { DialogService } from '@ngneat/dialog';
import { CardRequestCreateComponent } from 'src/app/components/cards/card-request-create/card-request-create.component';

@Component({
  selector: 'app-requests',
  templateUrl: './requests.component.html',
  styles: [
  ]
})
export class RequestsComponent implements OnInit {

  constructor(
    private dialog: DialogService
  ) { }

  ngOnInit(): void {
  }

  onCreateRequest() {
    this.dialog.open(CardRequestCreateComponent);
  }

}
