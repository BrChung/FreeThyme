import { Component, OnInit, Input } from "@angular/core";
import { Member } from "../../models/member";
import { NbIconModule } from "@nebular/theme";

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

  constructor() {}

  ngOnInit(): void {}
}
