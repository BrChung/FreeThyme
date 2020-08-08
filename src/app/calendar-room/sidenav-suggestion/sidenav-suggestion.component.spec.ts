import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidenavSuggestionComponent } from './sidenav-suggestion.component';

describe('SidenavSuggestionComponent', () => {
  let component: SidenavSuggestionComponent;
  let fixture: ComponentFixture<SidenavSuggestionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidenavSuggestionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidenavSuggestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
