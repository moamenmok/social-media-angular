import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookmarksComponent } from './bookmarks.component';

describe('BookmarksComponent', () => {
  let component: BookmarksComponent;
  let fixture: ComponentFixture<BookmarksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookmarksComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BookmarksComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
