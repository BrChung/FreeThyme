import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CalendarRoomRoutingModule } from "./calendar-room-routing.module";
import { CalendarRoomComponent } from "./calendar-room.component";
import { SharedModule } from "../shared/shared.module";
import { AddCalendarComponent } from "./add-calendar/add-calendar.component";
import { CalendarModule } from "angular-calendar";
import { AddEventComponent } from './add-event/add-event.component';
import { RoomMemberListComponent } from './room-member-list/room-member-list.component';
import { SettingsComponent } from './settings/settings.component';

@NgModule({
  declarations: [CalendarRoomComponent, AddCalendarComponent, AddEventComponent, RoomMemberListComponent, SettingsComponent],
  imports: [
    CommonModule,
    CalendarRoomRoutingModule,
    SharedModule,
    CalendarModule,
  ],
})
export class CalendarRoomModule {}
