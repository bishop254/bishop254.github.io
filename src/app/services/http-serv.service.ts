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
    endpoint = 'https://d6ac-41-90-65-6.ngrok-free.app/bursary/register';
    return this.http.post(endpoint, model, {
      headers: this.genHeaders(),
    });
  }
}
