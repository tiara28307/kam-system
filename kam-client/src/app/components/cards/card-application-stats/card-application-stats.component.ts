import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-application-stats',
  templateUrl: './card-application-stats.component.html',
  styles: [
  ]
})
export class CardApplicationStatsComponent implements OnInit {
  @Input()
  get appSubtitle(): string {
    return this._appSubtitle;
  }
  set appSubtitle(appSubtitle: string) {
    this._appSubtitle = appSubtitle === undefined ? "Application" : appSubtitle;
  }
  private _appSubtitle = "Application";

  @Input()
  get appTitle(): number {
    return this._appTitle;
  }
  set appTitle(appTitle: number) {
    this._appTitle = appTitle === undefined ? 10 : appTitle;
  }
  private _appTitle = 10;

  constructor() {}

  ngOnInit(): void {}
}
