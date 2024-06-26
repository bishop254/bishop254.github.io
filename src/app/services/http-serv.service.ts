import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpServService {
  constructor(private http: HttpClient) {}

  private genHeaders(): HttpHeaders {
    return new HttpHeaders({
      'ngrok-skip-browser-warning': 'true',
      'Access-Control-Allow-Origin': '*',
    });
  }

  public postReq(endpoint: string, model: any): Observable<any> {
    // endpoint = 'https://bd37-41-90-70-159.ngrok-free.app/bursary/register';
    endpoint = 'https://mig-bursary.com/bursary/register';
    return this.http.post(endpoint, model, {
      headers: this.genHeaders(),
    });
  }
}
