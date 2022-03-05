import { Component, OnInit } from "@angular/core";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-index",
  templateUrl: "./index.component.html",
})
export class IndexComponent implements OnInit {
  whitePaper = environment.whitePaper;
  constructor() {}

  ngOnInit(): void {}
}
