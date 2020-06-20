import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoomMemberListComponent } from './room-member-list.component';

describe('RoomMemberListComponent', () => {
  let component: RoomMemberListComponent;
  let fixture: ComponentFixture<RoomMemberListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoomMemberListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoomMemberListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
