import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { environment } from "../environments/environment";
import { AngularFireModule } from "angularfire2";
import { AngularFirestoreModule } from "angularfire2/firestore";
import { AngularFireAuthModule } from "@angular/fire/auth";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { SharedModule } from "./shared/shared.module";
import { CalendarModule } from "angular-calendar";
import { DateAdapter } from "angular-calendar";
import { adapterFactory } from "angular-calendar/date-adapters/date-fns";
import { MsalModule } from "@azure/msal-angular";

// Services
import { AuthService } from "./services/auth.service";
import { CalendarService } from "./services/calendar.service";
import { GraphService } from "./services/graph.service";
import { AuthSnackbarService } from "./services/auth-snackbar.service";
import { GoogleCalendarService } from "./services/google-calendar.service";

const isIE =
  window.navigator.userAgent.indexOf("MSIE ") > -1 ||
  window.navigator.userAgent.indexOf("Trident/") > -1;
export const protectedResourceMap: [string, string[]][] = [
  ["https://graph.microsoft.com/v1.0/me", ["user.read"]],
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase, "angularfs"),
    AngularFireAuthModule,
    AngularFirestoreModule,
    BrowserAnimationsModule,
    SharedModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    MsalModule.forRoot(
      {
        auth: {
          clientId: environment.microsoftGraph.appId,
          authority: "https://login.microsoftonline.com/common/",
          validateAuthority: true,
          redirectUri: "http://localhost:4200/",
          postLogoutRedirectUri: "http://localhost:4200/",
          navigateToLoginRequestUrl: true,
        },
        cache: {
          cacheLocation: "localStorage",
          storeAuthStateInCookie: isIE, // set to true for IE 11
        },
      },
      {
        popUp: !isIE,
        consentScopes: [
          "user.read",
          "openid",
          "profile",
          "api://a88bb933-319c-41b5-9f04-eff36d985612/access_as_user",
        ],
        unprotectedResources: ["https://www.microsoft.com/en-us/"],
        protectedResourceMap,
        extraQueryParameters: {},
      }
    ),
  ],
  providers: [
    AuthService,
    CalendarService,
    GraphService,
    AuthSnackbarService,
    GoogleCalendarService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
