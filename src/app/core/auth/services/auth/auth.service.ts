import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);

  register(data: object): Observable<any> {
    return this.httpClient.post(`${environment.BaseUrl}/users/signup`, data);
  }
  login(data: object): Observable<any> {
    return this.httpClient.post(`${environment.BaseUrl}/users/signin`, data);
  }
  loggedOut() {
    localStorage.removeItem('socialToken');
    localStorage.removeItem('socialUser');
    this.router.navigate(['/login']);
  }
}
