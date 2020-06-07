import { Component, OnInit, Input } from "@angular/core";
import { CalendarService } from "../../../services/calendar.service";
import { MatDialog } from "@angular/material/dialog";
import { ShareInviteMembersComponent } from "../../../shared/components/share-invite-members/share-invite-members.component";

@Component({
  selector: "app-calendar-grid-item",
  templateUrl: "./calendar-grid-item.component.html",
  styleUrls: ["./calendar-grid-item.component.scss"],
})
export class CalendarGridItemComponent implements OnInit {
  @Input() calID: string;
  @Input() room: any;
  @Input() imageURL: string = ""; //Not yet implemented
  @Input() favorite: boolean = false;
  rippleDisabled = false;
  displayTime: string;

  constructor(private calendar: CalendarService, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.displayTime = this.minutesToDhm(Number(this.room.meetingLength));
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

  async openInviteDialog(index: number) {
    if (event.stopPropagation) event.stopPropagation();
    this.dialog.open(ShareInviteMembersComponent, {
      width: "550px",
      data: {
        index,
        calID: this.calID,
      },
    });
  }
}
