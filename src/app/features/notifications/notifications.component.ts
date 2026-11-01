import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { NotificationService } from '../../core/auth/services/notification/notification.service'; // عدّل المسار
import { TimeAgoPipe } from '../../shared/pipes/time-ago-pipe'; // عدّل المسار
import { INotification } from '../../core/models/inotifaction.interface';

type NotificationKind = 'like' | 'comment' | 'share' | 'follow' | 'other';

@Component({
  selector: 'app-notifications',
  imports: [TimeAgoPipe],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css',
})
export class NotificationsComponent implements OnInit {
  private readonly notificationService = inject(NotificationService);
  isLoading = signal(false);

  notifications = signal<INotification[]>([]);
  unreadCount = signal(0);
  filter = signal<'all' | 'unread'>('all');

  visibleNotifications = computed(() =>
    this.filter() === 'unread'
      ? this.notifications().filter((n) => !n.isRead)
      : this.notifications(),
  );

  ngOnInit(): void {
    this.getNotifications();
    this.getUnreadCount();
  }

  getNotifications(): void {
    this.isLoading.set(true);

    this.notificationService.getNotifications().subscribe({
      next: (res) => {
        this.isLoading.set(false);

        this.notifications.set(res.data.notifications);
      },
      error: (err) => {
        this.isLoading.set(false);
      },
    });
  }

  getUnreadCount(): void {
    this.notificationService.getUnreadCount().subscribe({
      next: (res) => {
        this.unreadCount.set(res.data.unreadCount);
      },
    });
  }

  kind(n: INotification): NotificationKind {
    const t = n.type?.toLowerCase() ?? '';
    if (t.includes('like')) return 'like';
    if (t.includes('comment') || t.includes('reply')) return 'comment';
    if (t.includes('share')) return 'share';
    if (t.includes('follow')) return 'follow';
    return 'other';
  }

  getText(n: INotification): string {
    if (this.kind(n) === 'follow') return '';
    if (this.kind(n) === 'comment' && n.entity?.topComment?.content) {
      return n.entity.topComment.content;
    }
    return n.entity?.body ?? '';
  }

  markAsRead(id: string): void {
    this.notificationService.markAsRead(id).subscribe({
      next: () => {
        this.notifications.update((list) =>
          list.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
        );
        this.unreadCount.update((c) => Math.max(c - 1, 0));
      },
    });
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.notifications.update((list) => list.map((n) => ({ ...n, isRead: true })));
        this.unreadCount.set(0);
      },
    });
  }

  setFilter(value: 'all' | 'unread'): void {
    this.filter.set(value);
  }
}
