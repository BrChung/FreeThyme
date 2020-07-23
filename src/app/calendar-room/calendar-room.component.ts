// Angular Modules
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { MatDialog } from "@angular/material/dialog";

// Services
import { GraphService } from "../services/graph.service";
import { CalendarService } from "../services/calendar.service";
import { GoogleCalendarService } from "../services/google-calendar.service";
import { AuthService } from "../services/auth.service";

// Calendar Helper Libraries + Modules
import {
  CalendarEvent,
  CalendarEventTimesChangedEvent,
  CalendarView,
  CalendarDateFormatter,
} from "angular-calendar";
import { CustomWeeklyDateFormatter } from "./custom-weekly-date-formatter.provider";
import {
  isSameDay,
  isSameMonth,
  addDays,
  addMinutes,
  endOfWeek,
} from "date-fns";
import { WeekViewHourSegment } from "calendar-utils";

// Rxjs
import { Subject, Subscription, fromEvent } from "rxjs";
import { finalize, takeUntil, take } from "rxjs/operators";

// Components
import { AddCalendarComponent } from "./add-calendar/add-calendar.component";
import { AddEventComponent } from "./add-event/add-event.component";
import { MonthCalendarComponent } from "../shared/components/month-calendar/month-calendar.component";
import { ShareInviteMembersComponent } from "../shared/components/share-invite-members/share-invite-members.component";
import { SettingsComponent } from "./settings/settings.component";

@Component({
  selector: "app-calendar-room",
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: "./calendar-room.component.html",
  providers: [
    {
      provide: CalendarDateFormatter,
      useClass: CustomWeeklyDateFormatter,
    },
  ],
  styleUrls: ["./calendar-room.component.scss"],
})
export class CalendarRoomComponent implements OnInit, OnDestroy {
  @ViewChild("monthCalendar")
  monthCalendar: MonthCalendarComponent;
  count = 0;

  private routerSub: Subscription;
  private calendarSub: Subscription;
  private suggestedFTSub: Subscription;
  private votesSub: Subscription;
  timezone: String = this.getTimeZone();
  doc: any;

  room$: any;
  member$: any;
  votesFT: any;
  suggestedFT$: any;
  suggestedFT: any;
  calID: string;

  // Combines the suggestFT (from client function) and votesFT (from firebase)
  combinedSuggestion: any;

  refresh: Subject<any> = new Subject();

  view: CalendarView = CalendarView.Week;

  CalendarView = CalendarView;

  viewDate: Date = new Date();
  events: CalendarEvent[] = [];

  activeDayIsOpen: boolean = true;

  //Show your individual events
  showIndividual: boolean = false;

  weekStartsOn: 0 = 0;

  constructor(
    private route: ActivatedRoute,
    private calendar: CalendarService,
    public dialog: MatDialog,
    private graph: GraphService,
    private googleCal: GoogleCalendarService,
    private cdr: ChangeDetectorRef,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.routerSub = this.route.params.subscribe((params) => {
      this.calID = params["calID"];
    });

    this.calendarSub = this.calendar.getCalData(this.calID).subscribe((doc) => {
      this.doc = doc;
      this.addEventsToCal();
    });
    this.suggestedFTSub = this.calendar
      .getSuggestedMeetingTimes(this.calID, [10, 12, 14])
      .subscribe((res) => {
        this.suggestedFT = res;
        console.log(this.suggestedFT);
        console.timeEnd("Calculate FreeTime");
    this.votesSub = this.calendar.getVotesFT(this.calID).subscribe((docData) => {
      console.log(docData)
      // If there is data to be combined, then it should have > 1 keys: "meetingLength" + "votedTimes" (2 keys)
      if (Object.keys(docData).length > 1) {
        this.votesFT = docData;
        this.combinedSuggestion = this.calendar.combineSuggestions(this.calID, this.suggestedFT, this.votesFT);
      }
    })
    this.member$ = this.calendar.getMemberDoc(this.calID);
    this.room$ = this.calendar.getRoomDoc(this.calID);
    this.suggestedFT$ = this.calendar.getSuggestedMeetingTimes(this.calID, [
      10,
      12,
      14,
    ]);

      });
  }


  ngOnDestroy(): void {
    this.routerSub.unsubscribe();
    this.calendarSub.unsubscribe();
    this.suggestedFTSub.unsubscribe();
    this.votesSub.unsubscribe();
  }

  seeIndividualEvents(event) {
    this.showIndividual = event.checked;
    this.addEventsToCal();
  }

  printVotes() {
    console.log(this.votesSub);
  }

  // TODO:
  //  Increments the total number of votes for the suggested time
  //  Adds the users profile picture for the suggested time
  addVote(startTime: Date) {
    this.calendar.addVoteTime(startTime.toISOString(), this.calID);
  }

  addTempEvent(tempEventStart, tempEventEnd) {
    const tempEvent: CalendarEvent = {
      title: "",
      start: tempEventStart,
      end: tempEventEnd,
      color: { primary: "#C7A6DA", secondary: "#C7A6DA" },
      meta: {
        tmpEvent: true,
      },
    };
    this.events = [...this.events, tempEvent];
    this.refresh.next();
    console.log(this.events);
  }

  removeTempEvent() {
    this.events.pop();
    this.refresh.next();
  }

  addEventsToCal() {
    const doc = this.doc;
    let events = [];

    const googleEventsColor = "#F39668";
    const microsoftEventsColor = "#FFE085";
    const freethymeEventsColor = "#FF7370";

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
    if (doc && doc["individual"]["gc_events"] && this.showIndividual) {
      doc["individual"]["gc_events"].forEach((elm) => {
        const { start, end, title } = elm;
        events.push({
          start: start.toDate(),
          end: end.toDate(),
          title,
          meta: { type: "gc" },
          color: { primary: googleEventsColor, secondary: googleEventsColor },
        });
      });
    }
    if (doc && doc["individual"]["ms_events"] && this.showIndividual) {
      doc["individual"]["ms_events"].forEach((elm) => {
        const { start, end, title, description } = elm;
        events.push({
          start: start.toDate(),
          end: end.toDate(),
          title,
          meta: { type: "ms", description },
          color: {
            primary: microsoftEventsColor,
            secondary: microsoftEventsColor,
          },
        });
      });
    }
    if (doc && doc["individual"]["ft_events"] && this.showIndividual) {
      doc["individual"]["ft_events"].forEach((elm) => {
        const { start, end, title, description } = elm;
        events.push({
          start: start.toDate(),
          end: end.toDate(),
          title,
          meta: { type: "ft", description },
          color: {
            primary: freethymeEventsColor,
            secondary: freethymeEventsColor,
          },
        });
      });
    }
    this.events = events;
    this.refresh.next();
  }

  toggleFavorite(state: boolean) {
    this.calendar.changeFavorite(state, this.calID);
  }

  // I am using the green gradient from https://coolors.co/030202-36534b-638279-729164-9576a7
  // and then using Russian Green (729164 and selecting the view shades)
  countToColor(count: number) {
    var color: string;
    switch (count) {
      case 1:
        color = "#BFCCB7";
        break;
      case 2:
        color = "#A7BC9F";
        break;
      case 3:
        color = "#86A37B";
        break;
      case 4:
        color = "#719064";
        break;
      case 5:
        color = "#556C4B";
        break;
      default:
        color = "#394832";
    }
    return color;
  }

  // Function that is run when "add calendar" button is pressed
  // It renders the Add-calendar component to display the list of available calenders to select
  async openAddCalDialog() {
    const gapiStatus = await this.auth.isGapiAuthenticated();
    let googleCal,
      microsoftCal = (googleCal = []);
    if (gapiStatus) {
      googleCal = await this.googleCal.getCalendars();
      googleCal.sort((x, y) => {
        x.selected === y.selected ? 0 : x.selected ? -1 : 1;
      });
    }
    if (this.auth.msalAuthenticated) {
      microsoftCal = await this.graph.getCalendars();
    }
    this.dialog.open(AddCalendarComponent, {
      width: "400px",
      data: {
        googleCal,
        microsoftCal,
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

  async openAddEventDialog(event: CalendarEvent, eventId: string | number) {
    const dialogRef = this.dialog.open(AddEventComponent, {
      width: "550px",
      data: {
        calID: this.calID,
        event,
      },
    });

    const sub = dialogRef.componentInstance.refresh.subscribe(() => {
      this.refreshDom();
    });

    dialogRef.afterClosed().subscribe(() => {
      sub.unsubscribe();
      removeByAttr(this.events, "id", eventId);
      this.refreshDom();
    });
  }

  async openSettingsDialog() {
    this.dialog.open(SettingsComponent, {
      width: "550px",
    });
  }

  getTimeZone() {
    let tempDate = new Date().getTimezoneOffset();
    let timeOffset = (tempDate / 60) * -1;
    return (
      "GMT" +
      (timeOffset < 0 ? "-" : "+") +
      ("0" + Math.abs(timeOffset)).slice(-2)
    );
  }
  dateSelected(value: Date) {
    this.viewDate = value;
  }

  handleEvent(action: string, event: CalendarEvent) {
    console.log(action, event);
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
          this.openAddEventDialog(dragToSelectEvent, dragToSelectEvent.id);
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

var removeByAttr = function (arr, attr, value) {
  var i = arr.length;
  while (i--) {
    if (
      arr[i] &&
      arr[i].hasOwnProperty(attr) &&
      arguments.length > 2 &&
      arr[i][attr] === value
    ) {
      arr.splice(i, 1);
    }
  }
  return arr;
};
