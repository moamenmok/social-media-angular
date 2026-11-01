import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { HomeRightSidebarComponent } from './components/home-right-sidebar/home-right-sidebar.component';
import { HomeCenterContentComponent } from './components/home-center-content/home-center-content.component';
import { CreatePostComponent } from './components/create-post/create-post.component';
import { HomeLeftSidebarComponent } from './components/home-left-sidebar/home-left-sidebar.component';

@Component({
  selector: 'app-home',
  imports: [
    HomeRightSidebarComponent,
    HomeCenterContentComponent,
    CreatePostComponent,
    HomeLeftSidebarComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  ngOnInit(): void {
    initFlowbite();
  }
}
