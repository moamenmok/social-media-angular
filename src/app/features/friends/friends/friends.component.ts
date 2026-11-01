import { Component } from '@angular/core';
import { HomeRightSidebarComponent } from '../../home/components/home-right-sidebar/home-right-sidebar.component';

@Component({
  selector: 'app-friends',
  imports: [HomeRightSidebarComponent],
  templateUrl: './friends.component.html',
  styleUrl: './friends.component.css',
})
export class FriendsComponent {}
