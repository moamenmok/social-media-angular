import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-home-left-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './home-left-sidebar.component.html',
  styleUrl: './home-left-sidebar.component.css',
})
export class HomeLeftSidebarComponent {}
