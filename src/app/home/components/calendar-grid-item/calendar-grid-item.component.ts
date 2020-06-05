import { Component, OnInit, Input } from "@angular/core";
import { CalendarService } from "../../../services/calendar.service";
import { Member } from "../../../models/member";

@Component({
  selector: "app-calendar-grid-item",
  templateUrl: "./calendar-grid-item.component.html",
  styleUrls: ["./calendar-grid-item.component.scss"],
})
export class CalendarGridItemComponent implements OnInit {
  @Input() calID: string;
  @Input() title: string = "Untitled Calendar";
  @Input() description: string = "";
  @Input() meetingLength: number;
  @Input() meetingType: string = "General";
  @Input() members: Array<Member>;
  @Input() memberCount: number;
  @Input() profileImg: any;
  @Input() accentColor: string = "#3D94C7";
  @Input() imageURL: string = "";
  @Input() favorite: boolean = false;
  rippleDisabled = false;
  displayTime: string;

  constructor(private calendar: CalendarService) {}

  ngOnInit(): void {
    this.displayTime = this.minutesToDhm(Number(this.meetingLength));
  }

  minutesToDhm(mins: number) {
    const days = Math.floor(mins / 24 / 60);
    const hours = Math.floor((mins / 60) % 24);
    const minutes = mins % 60;
    const time = [
      days ? days + " day" + (days > 1 ? "s" : "") : "",
      hours ? hours + " hour" + (hours > 1 ? "s" : "") : "",
      minutes ? minutes + " min" + (minutes > 1 ? "s" : "") : "",
    ];
    return time.filter((el) => el != "").join(", ");
  }

  toggleFavorite() {
    if (event.stopPropagation) event.stopPropagation();
    this.calendar.changeFavorite(this.favorite, this.calID);
  }

  test() {
    if (event.stopPropagation) event.stopPropagation();
    console.log("test");
  }
}
