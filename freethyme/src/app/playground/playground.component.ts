import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { CalendarService } from "../services/calendar.service";
import { Member } from "../models/member";
import { Subscription } from "rxjs";

@Component({
  selector: "app-playground",
  templateUrl: "./playground.component.html",
  styleUrls: ["./playground.component.scss"],
})
export class PlaygroundComponent implements OnInit, OnDestroy {
  userExample: Array<Member>;
  images: any;
  roomSub: Subscription;
  rooms: any;

  constructor(public auth: AuthService, public calendar: CalendarService) {}
  ngOnInit(): void {
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

  ngOnDestroy() {
    this.roomSub.unsubscribe();
  }
}
