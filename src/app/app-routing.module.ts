import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { RoomComponent } from "./components/room/room.component";
import { PlaygroundComponent } from "./playground/playground.component";
import { AuthGuard } from "./user/auth.guard";

const routes: Routes = [
  { path: "playground", component: PlaygroundComponent }, //Temp
  {
    path: "",
    loadChildren: () =>
      import("./welcome/welcome.module").then((m) => m.WelcomeModule),
  },
  {
    path: "home",
    canActivate: [AuthGuard],
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
