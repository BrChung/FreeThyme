import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CalendarRoomRoutingModule } from "./calendar-room-routing.module";
import { CalendarRoomComponent } from "./calendar-room.component";
import { SharedModule } from "../shared/shared.module";
import { AddCalendarComponent } from './add-calendar/add-calendar.component';

@NgModule({
  declarations: [CalendarRoomComponent, AddCalendarComponent],
  imports: [CommonModule, CalendarRoomRoutingModule, SharedModule],
})
export class CalendarRoomModule {}
