import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-aml-sidebar',
  templateUrl: './aml-sidebar.component.html',
  styles: [
  ]
})
export class AmlSidebarComponent implements OnInit {
  dashboardLink = "['/user/aml/dashboard']";
  transactionLink = "['/user/aml/transactions']";
  alertLink = "['/user/aml/alerts']";

  constructor() { }

  ngOnInit(): void {
  }

}
