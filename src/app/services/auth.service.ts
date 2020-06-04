import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AngularFireAuth } from "@angular/fire/auth";
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from "@angular/fire/firestore";
import { environment } from "../../environments/environment";
import { auth } from "firebase/app";
import { User } from "../models/user";

declare var gapi: any;

@Injectable({
  providedIn: "root",
})
export class AuthService {
  user$: Observable<firebase.User>;
  calendarItems: any[];
  calendarList: any[];

  constructor(public afAuth: AngularFireAuth, private afs: AngularFirestore) {
    this.initClient();
    this.user$ = afAuth.authState;
  }

  // Initialize the Google API client with desired scopes
  initClient() {
    gapi.load("client", () => {
      console.log("loaded client");

      // It's OK to expose these credentials, they are client safe.
      gapi.client.init(environment.googleCal);

      gapi.client.load("calendar", "v3", () => console.log("loaded calendar"));
    });
  }

  async login() {
    const googleAuth = gapi.auth2.getAuthInstance();
    const googleUser = await googleAuth.signIn();
    const token = googleUser.getAuthResponse().id_token;
    const credential = auth.GoogleAuthProvider.credential(token);
    const reterievedData = await this.afAuth.auth.signInAndRetrieveDataWithCredential(
      credential
    );
    return this.updateUserData(reterievedData.user);
  }
  logout() {
    this.afAuth.auth.signOut();
  }

  async getEvents() {
    const events = await gapi.client.calendar.events.list({
      calendarId: "hjs8vmh2j8gunl8jld5q5qp8ps@group.calendar.google.com",
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 10,
      orderBy: "startTime",
    });

    console.log(events);

    this.calendarItems = events.result.items;
  }

  async getCalendars() {
    const calendars = await gapi.client.calendar.calendarList.list({});
    console.log(calendars);
    this.calendarList = calendars.result.items;
  }

  async insertEvent() {
    const insert = await gapi.client.calendar.events.insert({
      calendarId: "primary",
      start: {
        dateTime: hoursFromNow(2),
        timeZone: "America/Los_Angeles",
      },
      end: {
        dateTime: hoursFromNow(3),
        timeZone: "America/Los_Angeles",
      },
      summary: "Have Fun!!!",
      description: "Do some cool stuff and have a fun time doing it",
    });

    await this.getEvents();
  }

  private updateUserData({ uid, email, displayName, photoURL }: User) {
    //Sets user data to firestore on login for more accurate data
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(
      `users/${uid}`
    );

    const data = {
      uid,
      email,
      displayName,
      photoURL,
      roles: {
        guest: true,
      },
    };

    return userRef.set(data, { merge: true });
  }
}

const hoursFromNow = (n) =>
  new Date(Date.now() + n * 1000 * 60 * 60).toISOString();
