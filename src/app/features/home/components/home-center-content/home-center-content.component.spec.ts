import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeCenterContentComponent } from './home-center-content.component';

describe('HomeCenterContentComponent', () => {
  let component: HomeCenterContentComponent;
  let fixture: ComponentFixture<HomeCenterContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeCenterContentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeCenterContentComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
