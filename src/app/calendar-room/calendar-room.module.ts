import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CalendarRoomRoutingModule } from "./calendar-room-routing.module";
import { CalendarRoomComponent } from './calendar-room.component';

@NgModule({
  declarations: [CalendarRoomComponent],
  imports: [CommonModule, CalendarRoomRoutingModule],
})
export class CalendarRoomModule {}
