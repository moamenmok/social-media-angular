import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { DatePipe } from '@angular/common';

import { UserInfoService } from '../../core/auth/services/user-info.service';
import { IProfile } from '../../core/models/iprofile.interface';
import { PostComponent } from '../../shared/post/post.component';
import { IPosts } from '../../core/models/iposts.interface';
import { BookmarksComponent } from '../bookmarks/bookmarks/bookmarks.component';

@Component({
  selector: 'app-profile',
  imports: [PostComponent, BookmarksComponent, DatePipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit {
  private readonly userInfo = inject(UserInfoService);

  myPosts = signal<IPosts[]>([]);
  userData: WritableSignal<IProfile> = signal({} as IProfile);
  isLoading = signal(false);
  errorMessage = signal('');
  photoPreview = signal<string | ArrayBuffer | null>(null);
  coverPreview = signal<string | ArrayBuffer | null>(null);
  selectedPhoto = signal<File | null>(null);
  selectedCover = signal<File | null>(null);
  uploadingPhoto = signal(false);
  uploadingCover = signal(false);

  getMyProfile(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.userInfo.getMyProfile().subscribe({
      next: (res) => {
        this.userData.set(res.data.user);
        this.getMyPosts(res.data.user._id);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.errorMessage.set('Failed to load posts. Please try again.');
        this.isLoading.set(false);
      },
    });
  }

  getMyPosts(userId: string): void {
    this.userInfo.getUaerProfile(userId).subscribe({
      next: (res) => this.myPosts.set(res.data.posts),
      error: (err) => {},
    });
  }

  selectPhoto(e: Event): void {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.selectedPhoto.set(file);
    const reader = new FileReader();
    reader.onload = () => this.photoPreview.set(reader.result);
    reader.readAsDataURL(file);
    input.value = '';
  }

  selectCover(e: Event): void {
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    this.selectedCover.set(file);
    const reader = new FileReader();
    reader.onload = () => this.coverPreview.set(reader.result);
    reader.readAsDataURL(file);
    input.value = '';
  }

  cancelPhoto(): void {
    this.selectedPhoto.set(null);
    this.photoPreview.set(null);
  }

  cancelCover(): void {
    this.selectedCover.set(null);
    this.coverPreview.set(null);
  }

  savePhoto(): void {
    const file = this.selectedPhoto();
    if (!file) return;

    const formData = new FormData();
    formData.append('photo', file);

    this.uploadingPhoto.set(true);
    this.userInfo.uploadImage('upload-photo', formData).subscribe({
      next: () => {
        this.uploadingPhoto.set(false);
        this.cancelPhoto();
        this.getMyProfile();
      },
      error: (err) => {
        this.uploadingPhoto.set(false);
      },
    });
  }

  saveCover(): void {
    const file = this.selectedCover();
    if (!file) return;

    const formData = new FormData();
    formData.append('cover', file);

    this.uploadingCover.set(true);
    this.userInfo.uploadImage('upload-cover', formData).subscribe({
      next: () => {
        this.uploadingCover.set(false);
        this.cancelCover();
        this.getMyProfile();
      },
      error: (err) => {
        this.uploadingCover.set(false);
      },
    });
  }

  onPostDeleted(postId: string): void {
    this.myPosts.update((posts) => posts.filter((p) => p._id !== postId));
  }
  onSaveChanged(e: { postId: string; saved: boolean }): void {
    if (!e.saved) this.onPostDeleted(e.postId);
  }

  ngOnInit(): void {
    initFlowbite();
    this.getMyProfile();
  }
}
