import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareInviteMembersComponent } from './share-invite-members.component';

describe('ShareInviteMembersComponent', () => {
  let component: ShareInviteMembersComponent;
  let fixture: ComponentFixture<ShareInviteMembersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShareInviteMembersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareInviteMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
