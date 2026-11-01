import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeLeftSidebarComponent } from './home-left-sidebar.component';

describe('HomeLeftSidebarComponent', () => {
  let component: HomeLeftSidebarComponent;
  let fixture: ComponentFixture<HomeLeftSidebarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeLeftSidebarComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeLeftSidebarComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
