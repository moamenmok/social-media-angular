import { Component, inject, input, OnInit, signal } from '@angular/core';
import { UserInfoService } from '../../../core/auth/services/user-info.service';
import { IPosts } from '../../../core/models/iposts.interface';
import { PostComponent } from '../../../shared/post/post.component';

@Component({
  selector: 'app-bookmarks',
  imports: [PostComponent],
  templateUrl: './bookmarks.component.html',
  styleUrl: './bookmarks.component.css',
})
export class BookmarksComponent implements OnInit {
  private readonly userInfo = inject(UserInfoService);

  savedPosts = signal<IPosts[]>([]);
  isLoading = signal(false);
  errorMessage = signal('');

  onPostDeleted(postId: string): void {
    this.savedPosts.update((posts) => posts.filter((p) => p._id !== postId));
  }

  onSaveChanged(e: { postId: string; saved: boolean }): void {
    if (!e.saved) this.onPostDeleted(e.postId);
  }

  loadBookmarks(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.userInfo.getMyBookmark().subscribe({
      next: (res) => {
        this.savedPosts.set(res.data.bookmarks);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Failed to load posts. Please try again.');
        this.isLoading.set(false);
      },
    });
  }

  ngOnInit(): void {
    this.loadBookmarks();
  }
}
