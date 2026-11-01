import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { LoginComponent } from './features/login/login.component';
import { RegisterComponent } from './features/register/register.component';
import { HomeComponent } from './features/home/home.component';
import { ProfileComponent } from './features/profile/profile.component';
import { NotificationsComponent } from './features/notifications/notifications.component';

import { authGuard } from './core/auth/guard/auth-guard';
import { loggedGuard } from './core/auth/guard/logged-guard';
import { PostDetailsComponent } from './features/post-details/post-details.component';
import { FriendsComponent } from './features/friends/friends/friends.component';
import { MenuComponent } from './features/menu/menu/menu.component';
import { ChangePassComponent } from './features/change-pass/change-pass.component';
import { NotFoundComponent } from './features/not-found/not-found.component';
import { BookmarksComponent } from './features/bookmarks/bookmarks/bookmarks.component';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [loggedGuard],

    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent, title: 'EGM-Login' },
      { path: 'register', component: RegisterComponent, title: 'EGM-Register' },
    ],
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'home', component: HomeComponent, title: 'EGM-Home' },
      { path: 'post-details/:id', component: PostDetailsComponent, title: 'EGM-post-details' },
      { path: 'friends', component: FriendsComponent, title: 'EGM-friends' },
      { path: 'change-password', component: ChangePassComponent, title: 'EGM-Change-Password' },
      { path: 'profile', component: ProfileComponent, title: 'EGM-Profile' },
      { path: 'menu', component: MenuComponent, title: 'EGM-setting' },
      { path: 'notification', component: NotificationsComponent, title: 'EGM-Notification' },
      { path: 'bookmarks', component: BookmarksComponent, title: 'EGM-Bookmarks' },
    ],
  },
  { path: '**', component: NotFoundComponent, title: 'EGM-Not-Found' },
];
