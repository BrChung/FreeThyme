import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home.component";
import { CalendarsComponent } from "./calendars/calendars.component";
import { AppointmentsComponent } from "./appointments/appointments.component";
import { AuthGuard } from "../user/auth.guard";

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
        canActivate: [AuthGuard],
      },
      {
        path: "appt",
        component: AppointmentsComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}
