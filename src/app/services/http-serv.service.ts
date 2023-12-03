import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HttpServService {
  constructor(private http: HttpClient) {}

  public postReq(endpoint: string, model: any): Observable<any> {
    endpoint = 'https://0e16-41-90-65-6.ngrok-free.app/bursary/register';
    return this.http.post(endpoint, model, {
      headers: {
        'ngrok-skip-browser-warning': 'true',
      },
    });
  } 
}
