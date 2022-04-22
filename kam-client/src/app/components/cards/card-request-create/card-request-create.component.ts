import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DialogRef } from '@ngneat/dialog';
import { RequestService } from 'src/app/services/request.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-card-request-create',
  templateUrl: './card-request-create.component.html',
  styles: [
  ]
})
export class CardRequestCreateComponent implements OnInit {
  requestForm: FormGroup
  user: any[];

  constructor(
    public ref: DialogRef,
    private formBuilder: FormBuilder,
    private requestService: RequestService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.user = this.userService.getUserData();
    this.requestForm = this.formBuilder.group({
      applicantEmail: ['', Validators.compose([
        Validators.required,
        Validators.email
      ])],
      companyName: [this.user[0].companyName, [Validators.required]],
      sender: [`${this.user[0].firstName} ${this.user[0].lastName}`, [Validators.required]],
      jobTitle: [this.user[0].jobTitle, [Validators.required]],
      email: [this.user[0].email, Validators.compose([
        Validators.required,
        Validators.email
      ])],
      message: [`${this.user[0].companyName} has requested access to your application.`, [Validators.required]],
    });
  }

  onSend() {
    const form = this.requestForm.controls
    let data = {
      applicantEmail: form.applicantEmail.value,
      companyName: form.companyName.value,
      sender: form.sender.value,
      jobTitle: form.jobTitle.value,
      email: form.email.value,
      message: form.message.value
    }
    
    this.ref.close();
  }

}
