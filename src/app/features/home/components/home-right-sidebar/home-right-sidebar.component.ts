import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { UserInfoService } from '../../../../core/auth/services/user-info.service';
import { IUser } from '../../../../core/models/iusers.interface';

@Component({
  selector: 'app-home-right-sidebar',
  imports: [],
  templateUrl: './home-right-sidebar.component.html',
  styleUrl: './home-right-sidebar.component.css',
})
export class HomeRightSidebarComponent implements OnInit {
  private readonly userInfo = inject(UserInfoService);
  ngOnInit(): void {
    this.getFrindes();
    this.loadFriends();
  }

  private readonly PAGE_SIZE = 5;
  friends: WritableSignal<IUser[]> = signal<IUser[]>([]);

  limit = signal(this.PAGE_SIZE);
  loadingMore = signal(false);
  hasMore = signal(true);
  getFrindes(): void {
    this.userInfo.getFollowSuggestions().subscribe({
      next: (response) => {
        console.log(response);
        this.friends.set(response.data.suggestions);
      },
      error: (err) => {
        console.error('Failed to users:', err);
      },
    });
  }
  followAndUnfollowUser(userId: string): void {
    this.userInfo.followAndUnfollowUser(userId).subscribe({
      next: (response) => {
        console.log('follow response:', response);
        this.getFrindes();
      },
      error: (err) => {
        console.error('Failed to follow post:', err);
      },
    });
  }
  loadFriends(): void {
    this.loadingMore.set(true);

    this.userInfo.getSuggestedFriends(this.limit()).subscribe({
      next: (res) => {
        const list = res.data.suggestions;
        this.friends.set(list);
        this.hasMore.set(list.length >= this.limit());
        this.loadingMore.set(false);
      },
      error: (err) => {
        this.loadingMore.set(false);
        console.error('Failed to load friends:', err);
      },
    });
  }

  showMore(): void {
    this.limit.update((l) => l + this.PAGE_SIZE);
    this.loadFriends();
  }
}
