import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { RoomService } from '../../services/room.service';

@Component({
  selector: 'app-room',
  templateUrl: './room.component.html',
  styleUrls: ['./room.component.scss']
})
export class RoomComponent implements OnInit {
  roomID: any;
  room: any;
  UID: any;


  constructor(
    private roomService: RoomService,
    private router: Router,
    private route: ActivatedRoute
    ) { }

  ngOnInit(): void {
    this.roomID = this.route.snapshot.params['id']
    this.roomService.getRoomDetails(this.roomID).subscribe(room => {
      this.room = room;
      console.log(this.room)
    })
  }


}
