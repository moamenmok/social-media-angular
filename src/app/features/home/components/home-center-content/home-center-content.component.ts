import {
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';

import { PostsService } from '../../../../core/auth/services/posts/posts.service';
import { IPosts } from '../../../../core/models/iposts.interface';
import { PostComponent } from '../../../../shared/post/post.component';

@Component({
  selector: 'app-home-center-content',
  standalone: true,
  imports: [PostComponent],
  templateUrl: './home-center-content.component.html',
  styleUrl: './home-center-content.component.css',
})
export class HomeCenterContentComponent implements OnInit {
  private readonly postsService = inject(PostsService);
  private readonly LIMIT = 10;

  allPosts = signal<IPosts[]>([]);
  page = signal(1);
  hasMore = signal(true);
  isLoading = signal(false);
  errorMessage = signal('');

  sentinel = viewChild<ElementRef<HTMLElement>>('sentinel');
  private observer: IntersectionObserver | null = null;

  constructor() {
    effect((onCleanup) => {
      const el = this.sentinel()?.nativeElement;
      if (!el) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) this.loadMore();
        },
        { rootMargin: '300px' },
      );
      observer.observe(el);

      onCleanup(() => observer.disconnect());
    });
  }

  ngOnInit(): void {
    this.getAllPosts();
  }

  getAllPosts(): void {
    this.page.set(1);
    this.hasMore.set(true);
    this.loadPosts();
  }

  loadMore(): void {
    if (this.isLoading() || !this.hasMore()) return;
    this.page.update((p) => p + 1);
    this.loadPosts();
  }

  private loadPosts(): void {
    if (this.isLoading()) return;
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.postsService.getAllPosts(this.page(), this.LIMIT).subscribe({
      next: (res) => {
        const list: IPosts[] = res.data.posts ?? [];

        this.allPosts.update((old) => (this.page() === 1 ? list : [...old, ...list]));

        this.hasMore.set(list.length === this.LIMIT);
        this.isLoading.set(false);
        this.recheck();
      },
      error: (err) => {
        console.error('Failed to load posts:', err);
        if (this.page() > 1) this.page.update((p) => p - 1);
        this.errorMessage.set('Failed to load posts. Please try again.');
        this.isLoading.set(false);
      },
    });
  }

  private recheck(): void {
    const el = this.sentinel()?.nativeElement;
    if (!el || !this.observer) return;
    setTimeout(() => {
      this.observer?.unobserve(el);
      this.observer?.observe(el);
    });
  }

  retry(): void {
    this.loadMore();
  }

  onPostDeleted(postId: string): void {
    this.allPosts.update((list) => list.filter((p) => p._id !== postId));
  }
}
