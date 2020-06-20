import { Component, OnInit, Input } from '@angular/core';
import { Member } from "../../models/member";
@Component({
  selector: 'app-room-member-list',
  templateUrl: './room-member-list.component.html',
  styleUrls: ['./room-member-list.component.scss']
})
export class RoomMemberListComponent implements OnInit {
  @Input() userCount: number = 0;
  @Input() users: Array<Member>;
  @Input() userImg: any;

  constructor() { }

  ngOnInit(): void {
  }

}
