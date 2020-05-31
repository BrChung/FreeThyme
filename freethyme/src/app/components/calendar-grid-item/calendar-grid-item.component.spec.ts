import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarGridItemComponent } from './calendar-grid-item.component';

describe('CalendarGridItemComponent', () => {
  let component: CalendarGridItemComponent;
  let fixture: ComponentFixture<CalendarGridItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarGridItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarGridItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
