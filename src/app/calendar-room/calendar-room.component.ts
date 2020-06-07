import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { CalendarService } from "../services/calendar.service";
import { MatDialog } from "@angular/material/dialog";
import {
  CalendarEvent,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from "angular-calendar";
import { isSameDay, isSameMonth } from "date-fns";
import { Subject } from "rxjs";
import { AddCalendarComponent } from "./add-calendar/add-calendar.component";
import { AuthService } from "../services/auth.service";
import { MonthCalendarComponent } from "../shared/components/month-calendar/month-calendar.component";

@Component({
  selector: "app-calendar-room",
  templateUrl: "./calendar-room.component.html",
  styleUrls: ["./calendar-room.component.scss"],
})
export class CalendarRoomComponent implements OnInit, OnDestroy {
  @ViewChild("monthCalendar")
  monthCalendar: MonthCalendarComponent;

  private routerSub: Subscription;
  private roomSub: Subscription;
  private memberSub: Subscription;

  room: any;
  member: any;
  calID: string;

  refresh: Subject<any> = new Subject();

  view: CalendarView = CalendarView.Week;

  CalendarView = CalendarView;

  viewDate: Date = new Date();
  events: CalendarEvent[] = [];

  activeDayIsOpen: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private calendar: CalendarService,
    public dialog: MatDialog,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.routerSub = this.route.params.subscribe((params) => {
      this.calID = params["calID"];
    });

    this.roomSub = this.calendar.getRoomDoc(this.calID).subscribe((room) => {
      this.room = room;
      room["calendar"].forEach((elm) => {
        console.log(elm);
        const { start, end } = elm;
        const colorHex = this.countToColor(elm["count"]);
        const color = { primary: colorHex, secondary: colorHex };
        this.events.push({
          start: start.toDate(),
          end: end.toDate(),
          color,
          title: "",
        });
      });
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

  countToColor(count: number) {
    var color: string;
    switch (count) {
      case 1:
        color = "#FFA07A";
        break;
      case 2:
        color = "#FA8072";
        break;
      case 3:
        color = "#F08080";
        break;
      case 4:
        color = "#CD5C5C";
        break;
      case 5:
        color = "#B22222";
        break;
      default:
        color = "#8B0000";
    }
    return color;
  }

  async openAddCalDialog() {
    const calendars = await this.auth.getCalendars();
    calendars.sort((x, y) => {
      x.selected === y.selected ? 0 : x.selected ? -1 : 1;
    });
    this.dialog.open(AddCalendarComponent, {
      width: "250px",
      data: {
        calendars,
        calID: this.calID,
      },
    });
  }

  dateSelected(value: Date) {
    this.viewDate = value;
  }

  handleEvent(action: string, event: CalendarEvent) {
    console.log(action);
  }

  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent("Dropped or resized", event);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
}
