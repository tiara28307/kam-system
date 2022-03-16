import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(private httpreq: HttpClient) { }

  sendMail(body) {
    return this.httpreq.post("http://localhost:8080/email", body, {
      headers: { 'Content-Type': 'application/json' }, 
      responseType: 'text'
    });
  }
}
