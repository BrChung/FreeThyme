import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { environment } from "../environments/environment";
import { AngularFireModule } from "angularfire2";
import { AngularFirestoreModule } from "angularfire2/firestore";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AuthService } from "./services/auth.service";
import { CalendarService } from "./services/calendar.service";

import { HomeComponent } from "./components/home/home.component";
import { RoomComponent } from "./components/room/room.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NbThemeModule, NbLayoutModule } from "@nebular/theme";
import { NbEvaIconsModule } from "@nebular/eva-icons";

import { SharedModule } from "./shared/shared.module";
import { PlaygroundComponent } from './playground/playground.component';

@NgModule({
  declarations: [AppComponent, HomeComponent, RoomComponent, PlaygroundComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase, "angularfs"),
    AngularFireAuthModule,
    AngularFirestoreModule,
    BrowserAnimationsModule,
    NbThemeModule.forRoot({ name: "default" }),
    NbLayoutModule,
    NbEvaIconsModule,
    SharedModule,
  ],
  providers: [AuthService, CalendarService],
  bootstrap: [AppComponent],
})
export class AppModule {}
