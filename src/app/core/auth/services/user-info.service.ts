import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class UserInfoService {
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);

  getMyProfile(): Observable<any> {
    return this.httpClient.get(`${environment.BaseUrl}/users/profile-data`);
  }
  // =============user-profile=============
  getMyBookmark(): Observable<any> {
    return this.httpClient.get(`${environment.BaseUrl}/users/bookmarks`);
  }
  uploadPhotoProfile(body: FormData): Observable<any> {
    return this.httpClient.put(`${environment.BaseUrl}/users/upload-cover`, body);
  }

  uploadImage(endpoint: 'upload-photo' | 'upload-cover', body: FormData): Observable<any> {
    return this.httpClient.put(`${environment.BaseUrl}/users/${endpoint}`, body);
  }
  // =============user-bookmark=============

  getFollowSuggestions(): Observable<any> {
    return this.httpClient.get(`${environment.BaseUrl}/users/suggestions`);
  }

  getSuggestedFriends(limit: number): Observable<any> {
    return this.httpClient.get(`${environment.BaseUrl}/users/suggestions`, {
      params: { limit },
    });
  }
  // =============user-suggestions=============

  getUaerProfile(userId: string): Observable<any> {
    return this.httpClient.get(`${environment.BaseUrl}/users/${userId}/posts`);
  }
  // =============user-profile=============

  followAndUnfollowUser(userId: string): Observable<any> {
    return this.httpClient.put(`${environment.BaseUrl}/users/${userId}/follow`, {});
  }
  // =============change-pass=============
  userChangePassword(body: any): Observable<any> {
    return this.httpClient.patch(`${environment.BaseUrl}/users/change-password`, body);
  }
  loggedOut() {
    localStorage.removeItem('socialToken');
    localStorage.removeItem('socialUser');
    this.router.navigate(['/login']);
  }
}
