import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-dashboard-stats',
  templateUrl: './card-dashboard-stats.component.html',
  styles: [
  ]
})
export class CardDashboardStatsComponent implements OnInit {
  @Input()
  get appSubtitle(): string {
    return this._appSubtitle;
  }
  set appSubtitle(appSubtitle: string) {
    this._appSubtitle = appSubtitle === undefined ? "" : appSubtitle;
  }
  private _appSubtitle = "";

  @Input()
  get appTitle(): number {
    return this._appTitle;
  }
  set appTitle(appTitle: number) {
    this._appTitle = appTitle === undefined ? 0 : appTitle;
  }
  private _appTitle = 0;

  constructor() {}

  ngOnInit(): void {}
}
