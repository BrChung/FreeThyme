import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { CalendarService } from "../services/calendar.service";

@Component({
  selector: "app-calendar-room",
  templateUrl: "./calendar-room.component.html",
  styleUrls: ["./calendar-room.component.scss"],
})
export class CalendarRoomComponent implements OnInit, OnDestroy {
  private routerSub: Subscription;
  private roomSub: Subscription;
  room: any;
  calID: string;

  constructor(
    private route: ActivatedRoute,
    private calendar: CalendarService
  ) {}

  ngOnInit(): void {
    this.routerSub = this.route.params.subscribe((params) => {
      this.calID = params["calID"];
    });

    this.roomSub = this.calendar
      .getRoomDetails(this.calID)
      .subscribe((room) => {
        this.room = room;
      });
  }

  ngOnDestroy(): void {
    this.routerSub.unsubscribe();
    this.roomSub.unsubscribe();
  }
}
