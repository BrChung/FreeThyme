import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./components/home/home.component";
import { RoomComponent } from "./components/room/room.component";
import { PlaygroundComponent } from "./playground/playground.component";

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "playground", component: PlaygroundComponent },
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
