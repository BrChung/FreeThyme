import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { CalendarService } from "../services/calendar.service";
import { MatDialog } from "@angular/material/dialog";
import {
  CalendarEvent,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from "angular-calendar";
import {
  isSameDay,
  isSameMonth,
  addDays,
  addMinutes,
  endOfWeek,
} from "date-fns";
import { Subject, Subscription, fromEvent } from "rxjs";
import { finalize, takeUntil } from "rxjs/operators";
import { AddCalendarComponent } from "./add-calendar/add-calendar.component";
import { AuthService } from "../services/auth.service";
import { MonthCalendarComponent } from "../shared/components/month-calendar/month-calendar.component";
import { ShareInviteMembersComponent } from "../shared/components/share-invite-members/share-invite-members.component";
import { WeekViewHourSegment } from "calendar-utils";

@Component({
  selector: "app-calendar-room",
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./calendar-room.component.html",
  styleUrls: ["./calendar-room.component.scss"],
})
export class CalendarRoomComponent implements OnInit, OnDestroy {
  @ViewChild("monthCalendar")
  monthCalendar: MonthCalendarComponent;

  private routerSub: Subscription;
  private calendarSub: Subscription;

  room$: any;
  member$: any;
  calID: string;

  refresh: Subject<any> = new Subject();

  view: CalendarView = CalendarView.Week;

  CalendarView = CalendarView;

  viewDate: Date = new Date();
  events: CalendarEvent[] = [];

  activeDayIsOpen: boolean = true;

  weekStartsOn: 0 = 0;

  constructor(
    private route: ActivatedRoute,
    private calendar: CalendarService,
    public dialog: MatDialog,
    private auth: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.routerSub = this.route.params.subscribe((params) => {
      this.calID = params["calID"];
    });

    this.calendarSub = this.calendar.getCalData(this.calID).subscribe((doc) => {
      let events = [];
      if (doc && doc["events"]) {
        doc["events"].forEach((elm) => {
          const { start, end } = elm;
          const colorHex = this.countToColor(elm["count"]);
          const color = { primary: colorHex, secondary: colorHex };
          events.push({
            start: start.toDate(),
            end: end.toDate(),
            color,
            title: "",
          });
        });
      }
      this.events = events;
      this.refresh.next();
    });

    this.member$ = this.calendar.getMemberDoc(this.calID);
    this.room$ = this.calendar.getRoomDoc(this.calID);
  }

  ngOnDestroy(): void {
    this.routerSub.unsubscribe();
    this.calendarSub.unsubscribe();
  }

  toggleFavorite(state: boolean) {
    this.calendar.changeFavorite(state, this.calID);
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
      width: "400px",
      data: {
        calendars,
        calID: this.calID,
      },
    });
  }

  async openInviteDialog(index: number) {
    this.dialog.open(ShareInviteMembersComponent, {
      width: "550px",
      data: {
        index,
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

  startDragToCreate(
    segment: WeekViewHourSegment,
    mouseDownEvent: MouseEvent,
    segmentElement: HTMLElement
  ) {
    const dragToSelectEvent: CalendarEvent = {
      id: this.events.length,
      title: "New event",
      start: segment.date,
      meta: {
        tmpEvent: true,
      },
    };
    this.events = [...this.events, dragToSelectEvent];
    const segmentPosition = segmentElement.getBoundingClientRect();
    const endOfView = endOfWeek(this.viewDate, {
      weekStartsOn: this.weekStartsOn,
    });

    fromEvent(document, "mousemove")
      .pipe(
        finalize(() => {
          delete dragToSelectEvent.meta.tmpEvent;
          console.log(dragToSelectEvent);
          this.refreshDom();
        }),
        takeUntil(fromEvent(document, "mouseup"))
      )
      .subscribe((mouseMoveEvent: MouseEvent) => {
        const minutesDiff = ceilToNearest(
          mouseMoveEvent.pageY - segmentPosition.top,
          30
        );

        const daysDiff =
          floorToNearest(
            mouseMoveEvent.clientX - segmentPosition.left,
            segmentPosition.width
          ) / segmentPosition.width;

        const newEnd = addDays(addMinutes(segment.date, minutesDiff), daysDiff);
        if (newEnd > segment.date && newEnd < endOfView) {
          dragToSelectEvent.end = newEnd;
        }
        this.refreshDom();
      });
  }
  private refreshDom() {
    this.events = [...this.events];
    this.cdr.detectChanges();
  }
}

function floorToNearest(amount: number, precision: number) {
  return Math.floor(amount / precision) * precision;
}

function ceilToNearest(amount: number, precision: number) {
  return Math.ceil(amount / precision) * precision;
}
