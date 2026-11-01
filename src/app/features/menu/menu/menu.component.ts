import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-menu',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent {
  private readonly router = inject(Router);
  loggedOut() {
    localStorage.removeItem('socialToken');
    localStorage.removeItem('socialUser');
    this.router.navigate(['/login']);
  }
}
