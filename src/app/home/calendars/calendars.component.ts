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
  roomSub: Subscription;
  rooms: any;
  breakpoint: number;
  showFavorite: boolean = false;

  constructor(public calendar: CalendarService) {}

  ngOnInit(): void {
    this.breakpoint =
      window.innerWidth >= 1475 ? 3 : window.innerWidth >= 1080 ? 2 : 1;
    this.roomSub = this.calendar.getRooms().subscribe((rooms) => {
      this.rooms = rooms;
      this.showFavorite = false;
      rooms.forEach((element) => {
        if (element.favorite) {
          return (this.showFavorite = true);
        }
      });
    });
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
