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
import { AuthSnackbarService } from "./auth-snackbar.service";

declare var gapi: any;

@Injectable({
  providedIn: "root",
})
export class AuthService {
  user$: Observable<firebase.User>;

  constructor(
    public afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private snack: AuthSnackbarService
  ) {
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

  async googleSignIn() {
    const googleAuth = gapi.auth2.getAuthInstance();
    const googleUser = await googleAuth.signIn();
    const token = googleUser.getAuthResponse().id_token;
    const credential = auth.GoogleAuthProvider.credential(token);
    const reterievedData = await this.afAuth.auth.signInAndRetrieveDataWithCredential(
      credential
    );
    return this.updateUserData(reterievedData.user);
  }

  async microsoftSignIn() {
    var provider = new auth.OAuthProvider("microsoft.com");
    provider.addScope("calendars.readwrite");
    this.afAuth.auth
      .signInWithPopup(provider)
      .then((result) => {
        console.log(result);
      })
      .catch((error) => {
        this.snack.authError(error.message);
      });
  }

  logout() {
    this.afAuth.auth.signOut();
  }

  async freebusy(items: Array<any>, timeMin: Date = new Date(), timeMax: Date) {
    return await gapi.client.calendar.freebusy.query({
      items,
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
    });
  }

  async getCalendars() {
    return new Promise<any>(async (resolve, reject) => {
      const data = await gapi.client.calendar.calendarList.list({});
      if (data.result.items) {
        resolve(data.result.items);
      } else {
        resolve(null);
      }
    });
  }

  async insertEvent() {
    //Test
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

  async getCurrentUser() {
    return new Promise<any>((resolve, reject) => {
      var user = this.afAuth.auth.onAuthStateChanged(function (user) {
        if (user) {
          resolve(user);
        } else {
          resolve(null);
        }
      });
    });
  }
}

const hoursFromNow = (n) =>
  new Date(Date.now() + n * 1000 * 60 * 60).toISOString();
