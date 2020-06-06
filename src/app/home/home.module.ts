import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HomeRoutingModule } from "./home-routing.module";
import { HomeComponent } from "./home.component";
import { CalendarsComponent } from "./calendars/calendars.component";
import { AppointmentsComponent } from "./appointments/appointments.component";
import { MatGridListModule } from "@angular/material/grid-list";
import { SharedModule } from "../shared/shared.module";
import { CalendarGridItemComponent } from "./components/calendar-grid-item/calendar-grid-item.component";
import { CreateCalendarComponent } from "./components/create-calendar/create-calendar.component";

@NgModule({
  declarations: [
    HomeComponent,
    CalendarsComponent,
    AppointmentsComponent,
    CalendarGridItemComponent,
    CreateCalendarComponent,
  ],
  imports: [CommonModule, HomeRoutingModule, SharedModule, MatGridListModule],
})
export class HomeModule {}
