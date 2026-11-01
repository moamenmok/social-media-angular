import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../../environments/environment.development';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly httpClient = inject(HttpClient);

  private readonly baseUrl = `${environment.BaseUrl}/notifications`;

  //============ all notifications//============
  getNotifications(page: number = 1, limit: number = 10): Observable<any> {
    return this.httpClient.get(`${environment.BaseUrl}/notifications?page=${page}&limit=${limit}`);
  }

  //============ unread  count//============
  getUnreadCount(): Observable<any> {
    return this.httpClient.get(`${environment.BaseUrl}/notifications/unread-count`);
  }

  //============Mark one  read============
  markAsRead(notificationId: string): Observable<any> {
    return this.httpClient.patch(`${environment.BaseUrl}/notifications/${notificationId}/read`, {});
  }
  //============Mark all  read============

  markAllAsRead(): Observable<any> {
    return this.httpClient.patch(`${environment.BaseUrl}/notifications/read-all`, {});
  }
}
