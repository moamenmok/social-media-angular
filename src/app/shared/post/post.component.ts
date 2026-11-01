import {
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  linkedSignal,
  OnInit,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Modal } from 'flowbite';
import { IPosts } from '../../core/models/iposts.interface';
import { IUser } from '../../core/models/iusers.interface';
import { PostCommentsComponent } from '../../features/home/components/post-comments/post-comments.component';
import { PostsService } from '../../core/auth/services/posts/posts.service';
import { TimeAgoPipe } from '../pipes/time-ago-pipe';

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [PostCommentsComponent, TimeAgoPipe, RouterLink, DatePipe],
  templateUrl: './post.component.html',
  styleUrl: './post.component.css',
})
export class PostComponent implements OnInit {
  private readonly postsService = inject(PostsService);
  private readonly destroyRef = inject(DestroyRef);

  post = input.required<IPosts>();
  detailsMode = input(false);
  deleted = output<string>();
  initiallySaved = input(false);
  saving = signal(false);
  saveChanged = output<{ postId: string; saved: boolean }>();
  userData = signal<IUser>({} as IUser);
  isOwner = computed(() => this.post().user._id === this.userData()._id);
  forceSaved = input(false);

  likes = linkedSignal(() => this.post().likes ?? []);
  body = linkedSignal(() => this.post().body);
  liked = computed(() => this.likes().includes(this.userData()._id));
  saved = signal(false);

  extraComments = signal(0);
  commentsTotal = computed(() => (this.post().commentsCount ?? 0) + this.extraComments());

  ngOnInit(): void {
    const saved = localStorage.getItem('socialUser');
    if (saved) this.userData.set(JSON.parse(saved));
    this.saved.set(this.forceSaved() || !!this.post().bookmarked);
  }

  // ================= like =================
  like(): void {
    const userId = this.userData()._id;
    const wasLiked = this.liked();

    const setLike = (on: boolean) =>
      this.likes.update((l) => (on ? [...l, userId] : l.filter((id) => id !== userId)));

    setLike(!wasLiked);
    this.postsService.likeAndDisslikePost(this.post()._id).subscribe({
      error: (err) => {
        console.error('Failed to toggle like:', err);
        setLike(wasLiked);
      },
    });
  }

  // ================= save =================

  save(): void {
    if (this.saving()) return;

    const previous = this.saved();
    this.saved.set(!previous);
    this.saving.set(true);

    this.postsService.savePost(this.post()._id).subscribe({
      next: () => {
        this.saving.set(false);
        this.saveChanged.emit({ postId: this.post()._id, saved: this.saved() });
      },
      error: () => {
        this.saved.set(previous);
        this.saving.set(false);
      },
    });
  }

  // ================= menu =================
  menuOpen = signal(false);
  toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }
  closeMenu(): void {
    this.menuOpen.set(false);
  }

  // ================= edit =================
  editing = signal(false);
  editText = signal('');
  savingEdit = signal(false);

  startEdit(): void {
    this.editText.set(this.body() ?? '');
    this.editing.set(true);
    this.closeMenu();
  }

  cancelEdit(): void {
    this.editing.set(false);
  }

  onEditInput(e: Event): void {
    this.editText.set((e.target as HTMLTextAreaElement).value);
  }

  saveEdit(): void {
    const text = this.editText().trim();
    if (!text || this.savingEdit()) return;

    const form = new FormData();
    form.append('body', text);

    this.savingEdit.set(true);
    this.postsService.updatePost(this.post()._id, form).subscribe({
      next: () => {
        this.body.set(text);
        this.editing.set(false);
        this.savingEdit.set(false);
      },
      error: (err) => {
        console.error('Failed to update post:', err);
        this.savingEdit.set(false);
      },
    });
  }

  // =================  (Flowbite modal) =================
  deleteModalEl = viewChild<ElementRef<HTMLElement>>('deleteModalEl');
  private deleteModal: Modal | null = null;
  deleting = signal(false);

  askDelete(): void {
    this.closeMenu();
    const el = this.deleteModalEl()?.nativeElement;
    if (!el) return;
    this.deleteModal ??= new Modal(el, {
      backdrop: 'dynamic',
      closable: true,
      backdropClasses: 'fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-sm',
    });
    this.deleteModal.show();
  }

  cancelDelete(): void {
    this.deleteModal?.hide();
  }

  confirmDelete(): void {
    if (this.deleting()) return;
    this.deleting.set(true);

    this.postsService.deletePost(this.post()._id).subscribe({
      next: () => {
        this.deleteModal?.hide();
        this.deleted.emit(this.post()._id);
      },
      error: (err) => {
        console.error('post delete err:', err);
        this.deleting.set(false);
        this.deleteModal?.hide();
      },
    });
  }

  constructor() {
    this.destroyRef.onDestroy(() => this.deleteModal?.hide());
  }
}
