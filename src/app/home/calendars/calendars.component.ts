import { Component, OnInit, OnDestroy } from "@angular/core";
import { Member } from "../../models/member";
import { Subscription } from "rxjs";
import { CalendarService } from "../../services/calendar.service";

@Component({
  selector: "app-calendars",
  templateUrl: "./calendars.component.html",
  styleUrls: ["./calendars.component.scss"],
})
export class CalendarsComponent implements OnInit, OnDestroy {
  userExample: Array<Member>;
  images: any;
  roomSub: Subscription;
  rooms: any;
  breakpoint: number;

  constructor(public calendar: CalendarService) {}

  ngOnInit(): void {
    this.breakpoint =
      window.innerWidth >= 1475 ? 3 : window.innerWidth >= 1080 ? 2 : 1;
    this.roomSub = this.calendar
      .getRooms()
      .subscribe((rooms) => (this.rooms = rooms));
    this.userExample = [
      {
        UID: "1234",
        nickname: "Brian Chung",
        roles: { admin: true },
        combined: "2-Brian Chung",
      },
      {
        UID: "12345",
        nickname: "Jason",
        roles: { admin: true },
        combined: "1-Jason",
      },
      {
        UID: "123456",
        nickname: "Blue",
        roles: { viewer: true },
        combined: "4-Blue",
      },
      {
        UID: "1234",
        nickname: "Blue",
        roles: { viewer: true },
        combined: "4-Blue",
      },
      {
        UID: "12345",
        nickname: "Blue",
        roles: { viewer: true },
        combined: "4-Blue",
      },
      {
        UID: "12345",
        nickname: "Blue",
        roles: { viewer: true },
        combined: "4-Blue",
      },
      {
        UID: "12345",
        nickname: "Blue",
        roles: { viewer: true },
        combined: "4-Blue",
      },
    ];
    this.images = {
      "1234":
        "https://lh3.googleusercontent.com/a-/AOh14Ghg14msqh6WPzIqGc67YHhGegBNdzJszhBWP_yJ4w=s96-c",
      "12345":
        "https://lh3.googleusercontent.com/a-/AOh14GhFTj5s0Xz4SjROR5gEQpfff50esTzJDT-LGM7YVg=s96-c",
    };
  }

  onResize(event) {
    this.breakpoint =
      event.target.innerWidth >= 1475
        ? 3
        : event.target.innerWidth >= 1080
        ? 2
        : 1;
  }

  ngOnDestroy() {
    this.roomSub.unsubscribe();
  }
}
