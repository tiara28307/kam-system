import { Component, Input, OnInit } from '@angular/core';
import { KycOnboardingService } from 'src/app/services/kyc-onboarding/kyc-onboarding.service';

@Component({
  selector: 'app-card-review-application',
  templateUrl: './card-review-application.component.html',
  styles: [
  ]
})
export class CardReviewApplicationComponent implements OnInit {
  appDetails: any[];

  @Input()
  get applicationDetails(): string {
    return this._applicationDetails;
  }
  set applicationDetails(applicationDetails: string) {
    this._applicationDetails = applicationDetails === '' ? '' : applicationDetails;
  }
  private _applicationDetails = '';

  constructor() { }

  ngOnInit(): void {
    this.appDetails = (JSON.parse(this.applicationDetails));
  }
}
