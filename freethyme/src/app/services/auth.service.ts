import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { auth } from 'firebase/app';
import { User } from '../models/user';
import { Room } from '../models/room';

declare var gapi: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  user$: Observable<firebase.User>;
  userId: string;

  constructor
  (public afAuth: AngularFireAuth, private afs: AngularFirestore) {
    this.initClient();
    this.user$ = afAuth.authState;
  }

  // Initialize the Google API client with desired scopes
  initClient() {
    gapi.load('client', () => {
      console.log('loaded client')

      // It's OK to expose these credentials, they are client safe.
      gapi.client.init({
        apiKey: 'AIzaSyBuR5_eDmJZuIXAYztNZmiHEXG5neSgO9o',
        clientId: '182621995345-4hu18t2bf0bc4636dqln5gt4scbtlqk0.apps.googleusercontent.com',
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
        scope: 'https://www.googleapis.com/auth/calendar'
      })

      gapi.client.load('calendar', 'v3', () => console.log('loaded calendar'));

    });



  }

  async login() {
    const googleAuth = gapi.auth2.getAuthInstance()
    const googleUser = await googleAuth.signIn();
    const token = googleUser.getAuthResponse().id_token;
    const credential = auth.GoogleAuthProvider.credential(token);
    const reterievedData = await this.afAuth.auth.signInAndRetrieveDataWithCredential(credential);
    return this.updateUserData(reterievedData.user);
  }
  logout() {
    this.afAuth.auth.signOut();
  }


  private updateUserData({uid, email, displayName, photoURL}: User){
    //Sets user data to firestore on login for more accurate data
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${uid}`);

    const data = {
      uid,
      email,
      displayName,
      photoURL,
      roles: {
        guest: true
      },
    };
    this.userId = uid;

    console.log("Saving to cloud firestore hehe")
    console.log(data)
    return userRef.set(data, {merge: true});
  }


}
