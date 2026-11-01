import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../../core/auth/services/auth/auth.service';
import { UserInfoService } from '../../../../core/auth/services/user-info.service';
import { IUser } from '../../../../core/models/iusers.interface';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly userInfo = inject(UserInfoService);

  userData: WritableSignal<IUser> = signal({} as IUser);

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
  loggedoutNavbar() {
    this.authService.loggedOut();
  }
  ngOnInit(): void {
    this.getMyProfile();

    initFlowbite();
  }
}
