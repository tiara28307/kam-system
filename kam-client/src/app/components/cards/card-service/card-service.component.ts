import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-service',
  templateUrl: './card-service.component.html',
  styles: [
  ]
})
export class CardServiceComponent implements OnInit {
  @Input()
  get serviceSubtitle(): string {
    return this._serviceSubtitle;
  }
  set serviceSubtitle(serviceSubtitle: string) {
    this._serviceSubtitle = serviceSubtitle === undefined ? "Service subtitle" : serviceSubtitle;
  }
  private _serviceSubtitle = "Service subtitle";

  @Input()
  get serviceTitle(): string {
    return this._serviceTitle;
  }
  set serviceTitle(serviceTitle: string) {
    this._serviceTitle = serviceTitle === undefined ? "Service" : serviceTitle;
  }
  private _serviceTitle = "Service";

  @Input()
  get serviceIcon(): string {
    return this._serviceIcon;
  }
  set serviceIcon(serviceIcon: string) {
    this._serviceIcon =
    serviceIcon === undefined ? "far fa-chart-bar" : serviceIcon;
  }
  private _serviceIcon = "far fa-chart-bar";

  @Input()
  get serviceIconColor(): string {
    return this._serviceIconColor;
  }
  set serviceIconColor(serviceIconColor: string) {
    this._serviceIconColor =
    serviceIconColor === undefined ? "bg-theme-500" : serviceIconColor;
  }
  private _serviceIconColor = "bg-theme-500";

  @Input()
  get serviceLink(): string {
    return this._serviceLink;
  }
  set serviceLink(serviceLink: string) {
    this._serviceLink =
    serviceLink === undefined ? "/" : serviceLink;
  }
  private _serviceLink = "/";

  constructor() { }

  ngOnInit(): void {
  }

}
