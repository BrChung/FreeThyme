import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CalendarRoomComponent } from "./calendar-room.component";

const routes: Routes = [
  { path: "", redirectTo: "/home/cal", pathMatch: "full" },
  {
    path: ":calID",
    component: CalendarRoomComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CalendarRoomRoutingModule {}
