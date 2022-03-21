import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-cms-sidebar',
  templateUrl: './cms-sidebar.component.html',
  styles: [
  ]
})
export class CmsSidebarComponent implements OnInit {
  dashboardLink = "['/user/casemanagement/dashboard']";
  reportLink = "['/user/casemanagement/reports']";
  historyLink = "['/user/casemanagement/history']";

  constructor() { }

  ngOnInit(): void {
  }

}
