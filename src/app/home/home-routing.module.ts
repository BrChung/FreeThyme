import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home.component";
import { CalendarsComponent } from "./calendars/calendars.component";
import { AppointmentsComponent } from "./appointments/appointments.component";

const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
    children: [
      {
        path: "",
        redirectTo: "cal",
      },
      {
        path: "cal",
        component: CalendarsComponent,
      },
      {
        path: "appt",
        component: AppointmentsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
