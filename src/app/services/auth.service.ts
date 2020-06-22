import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AngularFireAuth } from "@angular/fire/auth";
import { auth } from "firebase/app";
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from "@angular/fire/firestore";
import { MsalService } from "@azure/msal-angular";
import { AuthSnackbarService } from "./auth-snackbar.service";
import { environment } from "../../environments/environment";
import { User } from "../models/user";

// Declare Google API Client var (set on index.html)
declare var gapi: any;

@Injectable({
  providedIn: "root",
})
export class AuthService {
  public user$: Observable<firebase.User>;
  public msalAuthenticated: boolean;

  constructor(
    public afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private snack: AuthSnackbarService,
    private msalService: MsalService
  ) {
    this.initGapiClient();
    this.user$ = afAuth.authState;
    this.msalAuthenticated = this.msalService.getAccount() != null;
  }

  // Initialize the Google API client with desired scopes
  initGapiClient() {
    gapi.load("client", () => {
      gapi.client.init(environment.googleCal);
      gapi.client.load("calendar", "v3");
    });
  }

  // Google Sign In Method
  async googleSignIn(): Promise<User> {
    const googleUser = await this.gapiSignIn();
    if (!googleUser) return null;
    const token = googleUser.getAuthResponse().id_token;
    const credential = auth.GoogleAuthProvider.credential(token);
    const reterievedData = await this.afAuth.auth
      .signInWithCredential(credential)
      .catch((error) => {
        this.snack.authError(error.message);
      });
    if (!reterievedData) return null;
    if (await this.isLinkedWithMicrosoft()) {
      await this.msalSignIn();
    }
    this.updateUserData(reterievedData.user);
    return reterievedData.user;
  }

  // Microsoft Sign In Method
  async microsoftSignIn() {
    var provider = new auth.OAuthProvider("microsoft.com");
    provider.addScope("calendars.readwrite");
    this.afAuth.auth
      .signInWithPopup(provider)
      .then(async (res) => {
        if (await this.isLinkedWithGoogle()) {
          const googleUser = await this.gapiSignIn();
          if (!googleUser) return this.logout();
        }
        await this.msalSignIn();
      })
      .catch((error) => {
        this.snack.authError(error.message);
      });
  }

  // Link current account with Microsoft Provider
  async linkWithMicrosoft() {
    const prevUser = await this.getCurrentUser();
    if (!prevUser) return;
    var provider = new auth.OAuthProvider("microsoft.com");
    provider.addScope("calendars.readwrite");
    this.afAuth.auth.signInWithPopup(provider).catch((error) => {
      if (error.code === "auth/account-exists-with-different-credential") {
        return prevUser
          .linkWithCredential(error.credential)
          .then(async (linkResult) => {
            await this.msalSignIn();
            return this.afAuth.auth.signInWithCredential(linkResult.credential);
          });
      } else {
        this.snack.authError(error.message);
      }
    });
  }

  async msalSignIn(): Promise<void> {
    const result = await this.msalService
      .loginPopup(environment.microsoftGraph)
      .catch((error) => {
        this.snack.authError(error);
      });
    if (result) {
      this.msalAuthenticated = true;
    }
    return null;
  }

  async gapiSignIn(): Promise<any> {
    const googleAuth = gapi.auth2.getAuthInstance();
    return await googleAuth.signIn().catch((error: any) => {
      if (error.error === "popup_closed_by_user")
        this.snack.authError("Popup was closed, please try again.");
      else this.snack.authError(error);
    });
  }

  async getAccessToken(): Promise<string> {
    let result = await this.msalService
      .acquireTokenSilent(environment.microsoftGraph)
      .catch((error) => {
        this.snack.authError("Popup was closed, please try again.");
      });
    if (result) {
      console.log("Token acquired", result.accessToken);
      return result.accessToken;
    }
    return null;
  }

  async isLinkedWithGoogle() {
    const user = await this.getCurrentUser();
    if (!user) return null;
    const providers = user.providerData;
    if (providers.filter((e) => e.providerId === "google.com").length > 0) {
      return true;
    }
    return false;
  }

  async isLinkedWithMicrosoft() {
    const user = await this.getCurrentUser();
    if (!user) return null;
    const providers = user.providerData;
    if (providers.filter((e) => e.providerId === "microsoft.com").length > 0) {
      return true;
    }
    return false;
  }

  // Check if User is authenticated with GAPI
  isGapiAuthenticated(): boolean {
    const googleAuth = gapi.auth2.getAuthInstance();
    console.log(googleAuth.isSignedIn.get());
    return googleAuth.isSignedIn.get();
  }

  // Check if User is authenticated with MSAL
  isMsalAuthenticated(): boolean {
    console.log(this.msalService.getAccount() != null);
    return this.msalService.getAccount() != null;
  }

  logout() {
    this.afAuth.auth.signOut();
    const googleAuth = gapi.auth2.getAuthInstance();
    if (googleAuth.isSignedIn.get()) {
      googleAuth.signOut();
    }
    if (this.msalAuthenticated) {
      this.msalService.logout();
      this.msalAuthenticated = false;
    }
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
