import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-review-application',
  templateUrl: './card-review-application.component.html',
  styles: [
  ]
})
export class CardReviewApplicationComponent implements OnInit {
  @Input()
  get personalDetails(): any[] {
    return this._personalDetails;
  }
  set personalDetails(personalDetails: any[]) {
    this._personalDetails = personalDetails === [] ? [] : personalDetails;
  }
  private _personalDetails = [];

  @Input()
  get proofOfIdentity(): any[] {
    return this._proofOfIdentity;
  }
  set proofOfIdentity(poi: any[]) {
    this._proofOfIdentity = poi === [] ? [] : poi;
  }
  private _proofOfIdentity = [];

  @Input()
  get addressDetails(): any[] {
    return this._addressDetails;
  }
  set addressDetails(addressDetails: any[]) {
    this._addressDetails = addressDetails === [] ? [] : addressDetails;
  }
  private _addressDetails = [];

  @Input()
  get proofOfAddress(): any[] {
    return this._proofOfAddress;
  }
  set proofOfAddress(poa: any[]) {
    this._proofOfAddress = poa === [] ? [] : poa;
  }
  private _proofOfAddress = [];

  @Input()
  get contactInfo(): any[] {
    return this._contactInfo;
  }
  set contactInfo(contactInfo: any[]) {
    this._contactInfo = contactInfo === [] ? [] : contactInfo;
  }
  private _contactInfo = [];

  @Input()
  get declaration(): any[] {
    return this._declaration;
  }
  set declaration(declaration: any[]) {
    this._declaration = declaration === [] ? [] : declaration;
  }
  private _declaration = [];

  constructor() { }

  ngOnInit(): void {
  }

}
