import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogRef } from '@ngneat/dialog';
import { RequestService } from 'src/app/services/request.service';
import { UserService } from 'src/app/services/user.service';
import { FailedRequestSendAlert, RequestSentAlert } from 'src/constants/alerts.constant';

@Component({
  selector: 'app-card-create-request',
  templateUrl: './card-create-request.component.html',
  styles: [
  ]
})
export class CardCreateRequestComponent implements OnInit {
  requestForm: FormGroup
  user: any[];
  
  constructor(
    public ref: DialogRef,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private requestService: RequestService
  ) { }

  ngOnInit(): void {
    this.user = this.userService.getUserData();
    this.requestForm = this.formBuilder.group({
      applicantEmail: ['', Validators.compose([
        Validators.required,
        Validators.email
      ])],
      companyName: [this.user[0].companyName, Validators.required],
      sender: [`${this.user[0].firstName} ${this.user[0].lastName}`, Validators.required],
      jobTitle: [this.user[0].jobTitle, Validators.required],
      email: [this.user[0].email, Validators.compose([
        Validators.required,
        Validators.email
      ])],
      message: [`${this.user[0].companyName} has requested your application.`, Validators.required],
    });
  }

  onSend() {
    let aEmail = this.requestForm.controls.applicantEmail.value;
    let cName = this.requestForm.controls.companyName.value;
    let sender = this.requestForm.controls.sender.value;
    let jTitle = this.requestForm.controls.jobTitle.value;
    let sEmail = this.requestForm.controls.email.value;
    let msg = this.requestForm.controls.message.value

    let obj = {
      applicantEmail: aEmail,
      companyName: cName,
      sender: sender,
      jobTitle: jTitle,
      senderEmail: sEmail,
      message: msg
    }

    console.log('obj: ', obj);

    this.requestService.createNewRequest(obj).subscribe(
      res => {
        console.log('response: ', res);
        RequestSentAlert.fire({});
      },
      error => {
        FailedRequestSendAlert(error).fire({});
      }
    );
    this.ref.close;
  }
}
