import { Component } from "@angular/core";
import { slider, fader } from "./route-animation";
import { MatDialog } from "@angular/material/dialog";
import { CreateCalendarComponent } from "./components/create-calendar/create-calendar.component";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
  animations: [fader],
})
export class HomeComponent {
  constructor(public dialog: MatDialog) {}

  openCalendarDialog(): void {
    this.dialog.open(CreateCalendarComponent, {
      width: "650px",
    });
  }
}
