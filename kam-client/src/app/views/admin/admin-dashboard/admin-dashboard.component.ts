import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Web3StorageService } from 'src/app/services/web3-storage.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styles: [
  ]
})
export class AdminDashboardComponent implements OnInit {
  adminDashboardForm: FormGroup;
  statusCheck = [];

  constructor(
    private formBuilder: FormBuilder,
    private web3Storage: Web3StorageService
  ) { }

  ngOnInit(): void {
    this.adminDashboardForm = this.formBuilder.group({
      cid: ['', [Validators.required]]
    });
  }

  onCheckStatus(cidString) {
    const status = this.web3Storage.checkStatus(cidString);
    this.statusCheck.push(status);
  }
}
