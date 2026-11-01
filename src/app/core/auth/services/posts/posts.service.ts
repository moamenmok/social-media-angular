import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class PostsService {
  private readonly httpClient = inject(HttpClient);

  getAllPosts(page = 1, limit = 10): Observable<any> {
    return this.httpClient.get(`${environment.BaseUrl}/posts`, {
      params: { page, limit },
    });
  }
  //===========all posts===========
  createpost(body: any): Observable<any> {
    return this.httpClient.post(`${environment.BaseUrl}/posts`, body);
  }
  //===========create posts===========

  getpost(postId: any): Observable<any> {
    return this.httpClient.get(`${environment.BaseUrl}/posts/${postId}`);
  } //===========single posts===========
  getPostDetails(postId: any): Observable<any> {
    return this.httpClient.get(`${environment.BaseUrl}/posts/${postId}`);
  } //===========delete posts===========

  deletePost(postId: any): Observable<any> {
    return this.httpClient.delete(`${environment.BaseUrl}/posts/${postId}`);
  }
  //===========update posts===========
  updatePost(postId: any, body: any): Observable<any> {
    return this.httpClient.put(`${environment.BaseUrl}/posts/${postId}`, body);
  }
  //===========delete posts===========

  likeAndDisslikePost(postId: any): Observable<any> {
    return this.httpClient.put(`${environment.BaseUrl}/posts/${postId}/like`, {});
  }
  // ============likeAndDisslikePost============
  savePost(postId: string): Observable<any> {
    return this.httpClient.put(`${environment.BaseUrl}/posts/${postId}/bookmark`, {});
  }
  // ============bookmarkPost============

  sharePost(postId: any): Observable<any> {
    return this.httpClient.post(`${environment.BaseUrl}/posts/${postId}/share`, {});
  }
}
