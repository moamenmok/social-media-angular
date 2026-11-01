import { Component } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { RouterOutlet } from '@angular/router';
import { BottomNavbarComponent } from './components/bottom-navbar/bottom-navbar.component';
@Component({
  selector: 'app-main-layout',
  imports: [NavbarComponent, RouterOutlet, BottomNavbarComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css',
})
export class MainLayoutComponent {}
