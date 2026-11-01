import { Component, inject, OnInit, signal } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PostsService } from '../../core/auth/services/posts/posts.service';
import { IPosts } from '../../core/models/iposts.interface';
import { PostComponent } from '../../shared/post/post.component';

@Component({
  selector: 'app-post-details',
  imports: [PostComponent],
  templateUrl: './post-details.component.html',
  styleUrl: './post-details.component.css',
})
export class PostDetailsComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly postsService = inject(PostsService);
  private readonly location = inject(Location);
  private readonly router = inject(Router);

  post = signal<IPosts | null>(null);
  loading = signal(true);
  failed = signal(false);

  ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id')!;

    this.postsService.getPostDetails(id).subscribe({
      next: (res) => {
        this.post.set(res.data.post);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Failed to load post:', err);
        this.failed.set(true);
        this.loading.set(false);
      },
    });
  }

  goBack(): void {
    if (window.history.length > 1) {
      this.location.back();
    } else {
      this.router.navigate(['/home']);
    }
  }
}
