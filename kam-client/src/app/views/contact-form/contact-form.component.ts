import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EmailService } from 'src/app/services/email.service';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styles: [
  ]
})
export class ContactFormComponent implements OnInit {
  buttonText = "Send Message"
  nodeMailerForm: FormGroup;
  loading = false;
  isSent = false;

  constructor(
    private formBuilder: FormBuilder, 
    private emailService: EmailService
  ) { }

  ngOnInit(): void {
    this.nodeMailerForm = this.formBuilder.group({
      fullName: [null, [Validators.required]],
      email: [null, [Validators.required]],
      message: [null, [Validators.required]]
    });
  }

  sendMessage() {
    this.loading = true;
    let fullName = this.nodeMailerForm.value.fullName;
    let email = this.nodeMailerForm.value.email;
    let message = this.nodeMailerForm.value.message;
    let reqObject = {
      fullName: fullName,
      email: email,
      message: message
    }

    this.emailService.sendMail(reqObject).subscribe(
      res => {
        this.loading = false;
        this.isSent = true;
        this.buttonText = "Message Sent!";
        console.log('Response: ', res);
      },
      error => {
        setTimeout(() => {
          this.loading = false; 
          this.buttonText = "Try Again";
          }, 1000
        );
        console.error('Error: ', error)
      }
    );
  }
}
