import { Component, OnInit, Input } from "@angular/core";
import { Member } from "../../models/member";

@Component({
  selector: "app-calendar-grid-item",
  templateUrl: "./calendar-grid-item.component.html",
  styleUrls: ["./calendar-grid-item.component.scss"],
})
export class CalendarGridItemComponent implements OnInit {
  @Input() calID: string;
  @Input() title: string = "Untitled Calendar";
  @Input() description: string = "";
  @Input() meetingLength: number = 30;
  @Input() meetingType: string = "General";
  @Input() members: Array<Member>;
  @Input() accentColor: string = "#3D94C7";
  @Input() imageURL: string = "";
  displayTime: string = this.minutesToDhm(this.meetingLength);

  constructor() {}

  ngOnInit(): void {}

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
}
