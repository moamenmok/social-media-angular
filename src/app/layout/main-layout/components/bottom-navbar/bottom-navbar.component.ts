import { Component, HostListener, inject, OnInit, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NotificationService } from '../../../../core/auth/services/notification/notification.service';

@Component({
  selector: 'app-bottom-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './bottom-navbar.component.html',
  styleUrl: './bottom-navbar.component.css',
})
export class BottomNavbarComponent implements OnInit {
  private readonly notificationService = inject(NotificationService);

  unreadCount = signal(0);

  isVisible = signal(true);

  private lastScrollY = 0;

  ngOnInit(): void {
    this.notificationService.getUnreadCount().subscribe({
      next: (res) => this.unreadCount.set(res.data.unreadCount),
      error: (err) => console.error('Failed to load unread count:', err),
    });
  }

  @HostListener('window:scroll')
  onWindowScroll() {
    const currentScrollY = window.scrollY;

    if (currentScrollY <= 0) {
      this.isVisible.set(true);
    } else if (currentScrollY > this.lastScrollY) {
      this.isVisible.set(false);
    } else if (currentScrollY < this.lastScrollY) {
      this.isVisible.set(true);
    }

    this.lastScrollY = currentScrollY;
  }
}
