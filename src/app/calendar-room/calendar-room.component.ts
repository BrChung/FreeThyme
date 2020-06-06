import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { CalendarService } from "../services/calendar.service";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { AddCalendarComponent } from "./add-calendar/add-calendar.component";

@Component({
  selector: "app-calendar-room",
  templateUrl: "./calendar-room.component.html",
  styleUrls: ["./calendar-room.component.scss"],
})
export class CalendarRoomComponent implements OnInit, OnDestroy {
  private routerSub: Subscription;
  private roomSub: Subscription;
  private memberSub: Subscription;
  room: any;
  member: any;
  calID: string;

  constructor(
    private route: ActivatedRoute,
    private calendar: CalendarService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.routerSub = this.route.params.subscribe((params) => {
      this.calID = params["calID"];
    });

    this.roomSub = this.calendar.getRoomDoc(this.calID).subscribe((room) => {
      this.room = room;
    });

    this.memberSub = this.calendar
      .getMemberDoc(this.calID)
      .subscribe((member) => {
        this.member = member;
      });
  }

  ngOnDestroy(): void {
    this.routerSub.unsubscribe();
    this.roomSub.unsubscribe();
    this.memberSub.unsubscribe();
  }

  toggleFavorite() {
    this.calendar.changeFavorite(this.member.favorite, this.calID);
  }

  openAddCalDialog() {
    this.dialog.open(AddCalendarComponent, {
      width: "250px",
      data: {
        calendars: [
          { id: 100, name: "order 1" },
          { id: 200, name: "order 2" },
          { id: 300, name: "order 3" },
          { id: 400, name: "order 4" },
        ],
      },
    });
  }
}
