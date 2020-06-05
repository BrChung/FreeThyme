import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RoomComponent } from "./components/room/room.component";
import { PlaygroundComponent } from "./playground/playground.component";

const routes: Routes = [
  { path: "", redirectTo: "/home/cal", pathMatch: "full" },
  { path: "playground", component: PlaygroundComponent }, //Temp
  {
    path: "home",
    loadChildren: () => import("./home/home.module").then((m) => m.HomeModule),
  },
  { path: "cal/:id", component: RoomComponent },
  {
    path: "login",
    loadChildren: () => import("./user/user.module").then((m) => m.UserModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
