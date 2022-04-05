import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private httpreq: HttpClient) { }

  getCompanyTypes() {
    return this.httpreq.get("http://localhost:8081/register/companytypes", {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'json'
    });
  }

  getCountries() {
    return this.httpreq.get("http://localhost:8081/register/countries", {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'json'
    });
  }

}
