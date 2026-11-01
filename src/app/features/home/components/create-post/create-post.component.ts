import {
  Component,
  ElementRef,
  inject,
  OnInit,
  output,
  signal,
  viewChild,
  WritableSignal,
} from '@angular/core';
import { UserInfoService } from '../../../../core/auth/services/user-info.service';
import { initFlowbite } from 'flowbite';
import { IUser } from '../../../../core/models/iusers.interface';
import { FormControl, ɵInternalFormsSharedModule, ReactiveFormsModule } from '@angular/forms';
import { PostsService } from '../../../../core/auth/services/posts/posts.service';

@Component({
  selector: 'app-create-post',
  imports: [ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './create-post.component.html',
  styleUrl: './create-post.component.css',
})
export class CreatePostComponent implements OnInit {
  private readonly userInfo = inject(UserInfoService);
  private readonly postsService = inject(PostsService);

  fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  userData: WritableSignal<IUser> = signal({} as IUser);
  postCreated = output<void>();
  privacyInput = new FormControl('public');
  bodyInput = new FormControl('');
  imgRender: WritableSignal<string | ArrayBuffer | null | undefined> = signal(null);

  selectedImage = signal<File | null>(null);
  getMyProfile(): void {
    this.userInfo.getMyProfile().subscribe({
      next: (response) => {
        console.log(this.userData);
        this.userData.set(response.data.user);
      },
      error: (err) => {
        console.error('Failed to users:', err);
      },
    });
  }

  selectImage(e: Event): void {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.selectedImage.set(file);
    const reader = new FileReader();
    reader.onload = () => this.imgRender.set(reader.result);
    reader.readAsDataURL(file);
  }
  restImg(form: HTMLFormElement) {
    this.imgRender.set(null);
    this.selectedImage.set(null);
    form.reset();
  }
  // ====================image===========
  formSubmit(e: SubmitEvent, form: HTMLFormElement) {
    e.preventDefault();
    let myForm = new FormData();

    if (this.selectedImage()) {
      myForm.append('image', this.selectedImage()!);
    }
    if (this.bodyInput.value) {
      myForm.append('body', this.bodyInput.value);
    }
    if (this.privacyInput.value) {
      myForm.append('privacy', this.privacyInput.value);
    }
    this.postsService.createpost(myForm).subscribe({
      next: (res) => {
        // clear
        form.reset();

        this.bodyInput.reset('');
        this.privacyInput.reset('public');

        this.selectedImage.set(null);
        this.imgRender.set(null);

        this.postCreated.emit();
      },
      error: (error) => {
        console.log(error);
      },
    });
  }

  saveUserData(): void {
    const saved = localStorage.getItem('socialUser');
    if (saved) this.userData.set(JSON.parse(saved));
  }
  ngOnInit(): void {
    initFlowbite();
    this.getMyProfile();
    this.saveUserData();
  }
}
