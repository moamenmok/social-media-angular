import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private readonly httpClient = inject(HttpClient);

  getPostComments(postId: any): Observable<any> {
    return this.httpClient.get(`${environment.BaseUrl}/posts/${postId}/comments?page=1&limit=10`);
  }
  //===========all comments===========

  createComments(body: FormData, postId: string): Observable<any> {
    return this.httpClient.post(`${environment.BaseUrl}/posts/${postId}/comments`, body);
  }
  //===========create comments===========

  getCommentReplies(CommentId: any): Observable<any> {
    return this.httpClient.get(`${environment.BaseUrl}	/posts/comments/${CommentId}/replies`);
  }
  //===========delete comments===========

  deleteComment(postId: string, commentId: string): Observable<any> {
    return this.httpClient.delete(`${environment.BaseUrl}/${postId}/comments/${commentId}`);
  }

  //===========update comments===========

  updateComment(postId: string, commentId: string, content: string): Observable<any> {
    return this.httpClient.put(
      `${environment.BaseUrl}	/posts/${postId}/comments/${commentId}`,
      this.buildForm(content),
    );
  }

  // PUT:
  toggleCommentLike(postId: string, commentId: string): Observable<any> {
    return this.httpClient.put(
      `${environment.BaseUrl}	/posts/${postId}/comments/${commentId}/like`,
      {},
    );
  }
  private buildForm(content: string, image?: File | null): FormData {
    const form = new FormData();
    if (content) form.append('content', content);
    if (image) form.append('image', image);
    return form;
  }
}
