import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BooksCatelogComponent } from './books-catelog.component';

describe('BooksCatelogComponent', () => {
  let component: BooksCatelogComponent;
  let fixture: ComponentFixture<BooksCatelogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BooksCatelogComponent]
    });
    fixture = TestBed.createComponent(BooksCatelogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
