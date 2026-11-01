import {
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  OnInit,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { CommentsService } from '../../../../core/auth/services/comments/comments.service';
import { IComments } from '../../../../core/models/icomments.interface';
import { IUser } from '../../../../core/models/iusers.interface';
import { TimeAgoPipe } from '../../../../shared/pipes/time-ago-pipe';
import { Modal } from 'flowbite';

@Component({
  selector: 'app-post-comments',
  imports: [TimeAgoPipe],
  templateUrl: './post-comments.component.html',
  styleUrl: './post-comments.component.css',
})
export class PostCommentsComponent implements OnInit {
  private readonly commentsService = inject(CommentsService);
  private readonly destroyRef = inject(DestroyRef);
  private deleteModal: Modal | null = null;

  postId = input.required<string>();
  postOwnerId = input<string>('');

  commentCreated = output<void>();
  commentDeleted = output<void>();

  fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');
  isLoading = signal(false);

  userData = signal<IUser>({} as IUser);
  postComments = signal<IComments[]>([]);

  deleteModalEl = viewChild<ElementRef<HTMLElement>>('deleteModalEl');
  commentToDelete = signal<IComments | null>(null);

  // ====== composer ======
  commentText = signal('');
  imgRender = signal<string | null>(null);
  selectedImage = signal<File | null>(null);
  sending = signal(false);

  canSend = computed(
    () => (this.commentText().trim().length > 0 || !!this.selectedImage()) && !this.sending(),
  );

  openMenuId = signal<string | null>(null);
  editingId = signal<string | null>(null);
  editText = signal('');

  ngOnInit(): void {
    this.saveUserData();
    this.getPostComments();
  }

  saveUserData(): void {
    const saved = localStorage.getItem('socialUser');
    if (saved) this.userData.set(JSON.parse(saved));
  }

  // ================= loading =================
  getPostComments(): void {
    this.isLoading.set(true);

    this.commentsService.getPostComments(this.postId()).subscribe({
      next: (res) => {
        this.isLoading.set(false);

        if (res.data.comments) {
          this.postComments.set(res.data.comments);
        }
      },
      error: (err) => {
        console.error('Failed to load comments:', err);
        this.isLoading.set(false);
      },
    });
  }

  // ================ add comment =================
  onCommentInput(e: Event): void {
    this.commentText.set((e.target as HTMLTextAreaElement).value);
  }

  selectImage(e: Event): void {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.selectedImage.set(file);
    const reader = new FileReader();
    reader.onload = () => this.imgRender.set(reader.result as string);
    reader.readAsDataURL(file);
  }

  restImg(): void {
    this.imgRender.set(null);
    this.selectedImage.set(null);
    const el = this.fileInput()?.nativeElement;
    if (el) el.value = '';
  }

  formSubmit(e: Event): void {
    e.preventDefault();
    if (!this.canSend()) return;

    const myForm = new FormData();
    if (this.selectedImage()) {
      myForm.append('image', this.selectedImage()!);
    }
    if (this.commentText().trim()) {
      myForm.append('content', this.commentText().trim());
    }

    this.sending.set(true);
    this.commentsService.createComments(myForm, this.postId()).subscribe({
      next: () => {
        this.sending.set(false);
        this.commentText.set('');
        this.restImg();
        this.getPostComments();
        this.commentCreated.emit();
      },
      error: (err) => {
        this.sending.set(false);
        console.error('Failed to add comment:', err);
      },
    });
  }

  isOwner(c: IComments): boolean {
    return c.commentCreator?._id === this.userData()._id;
  }

  canDelete(c: IComments): boolean {
    return this.isOwner(c) || (!!this.postOwnerId() && this.postOwnerId() === this.userData()._id);
  }

  isLiked(c: IComments): boolean {
    return !!c.likes?.includes(this.userData()._id);
  }

  // ================= like =================
  toggleLike(c: IComments): void {
    const userId = this.userData()._id;
    const wasLiked = this.isLiked(c);

    const setLikes = (on: boolean) =>
      this.postComments.update((list) =>
        list.map((x) =>
          x._id === c._id
            ? {
                ...x,
                likes: on
                  ? [...(x.likes ?? []), userId]
                  : (x.likes ?? []).filter((id) => id !== userId),
              }
            : x,
        ),
      );

    setLikes(!wasLiked); // تحديث فوري

    this.commentsService.toggleCommentLike(this.postId(), c._id).subscribe({
      error: (err) => {
        console.error('Failed to like:', err);
        setLikes(wasLiked); // رجّعه لو فشل
      },
    });
  }

  // =================MENU =================
  toggleMenu(id: string): void {
    this.openMenuId.update((cur) => (cur === id ? null : id));
  }

  closeMenu(): void {
    this.openMenuId.set(null);
  }

  startEdit(c: IComments): void {
    this.editingId.set(c._id);
    this.editText.set(c.content);
    this.closeMenu();
  }

  cancelEdit(): void {
    this.editingId.set(null);
    this.editText.set('');
  }

  onEditInput(e: Event): void {
    this.editText.set((e.target as HTMLTextAreaElement).value);
  }

  saveEdit(c: IComments): void {
    const content = this.editText().trim();
    if (!content) return;

    this.commentsService.updateComment(this.postId(), c._id, content).subscribe({
      next: () => {
        this.postComments.update((list) =>
          list.map((x) => (x._id === c._id ? { ...x, content } : x)),
        );
        this.cancelEdit();
      },
      error: (err) => console.error('Failed to edit comment:', err),
    });
  }
  askDelete(c: IComments): void {
    this.closeMenu();
    this.commentToDelete.set(c);
    this.deleteModal?.show();
  }

  cancelDelete(): void {
    this.deleteModal?.hide();
  }

  confirmDelete(): void {
    const c = this.commentToDelete();
    if (!c) return;

    this.commentsService.deleteComment(this.postId(), c._id).subscribe({
      next: () => {
        this.postComments.update((list) => list.filter((x) => x._id !== c._id));
        this.commentDeleted.emit();
        this.deleteModal?.hide();
      },
      error: (err) => {
        console.error('Failed to delete comment:', err);
        this.deleteModal?.hide();
      },
    });
  }
}
