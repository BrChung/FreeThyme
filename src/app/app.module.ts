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

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { SharedModule } from "./shared/shared.module";
import { PlaygroundComponent } from "./playground/playground.component";
import { CreateCalendarComponent } from "./components/create-calendar/create-calendar.component";

@NgModule({
  declarations: [AppComponent, CreateCalendarComponent, PlaygroundComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase, "angularfs"),
    AngularFireAuthModule,
    AngularFirestoreModule,
    BrowserAnimationsModule,
    SharedModule,
  ],
  providers: [AuthService, CalendarService],
  bootstrap: [AppComponent],
})
export class AppModule {}
