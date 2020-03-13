import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { auth } from 'firebase/app';
import { User } from '../models/user';
import { Room } from '../models/room';


declare var gapi: any;

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  user$: Observable<firebase.User>;
  calendarItems: any[];
  calendarList: any[];
  calendarIds: any[];


  constructor
  (public afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    ) {
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

  async getEvents() {
    // Grabs and updates the calendar Ids (can now use this.calendarIds)
    await this.getCalendars();
    // Simulating potential user input of how far ahead they want to look
    let daysInAdvance = 2;
    let timeMaximum = new Date();
    timeMaximum.setDate(timeMaximum.getDate() + daysInAdvance);

    // Simulating when the user selects which calendar to add
    // All calendars are selected by default, user will uncheck the ones they don't want
    // if a calendar item is unchecked that means
    console.log("Calendar Ids: ", this.calendarList)

    let calendarParameters = {
      resource: {
        timeMin: new Date().toISOString(),
        timeMax: timeMaximum,
        timeZone: 'America/Los_Angeles',
        items: this.calendarList
      }
    };
    const events = await gapi.client.calendar.freebusy.query(calendarParameters);

    // Save a quicker reference to all the queried calendars
    const tempCalendars = events.result.calendars;

    // Save a temporary list to store all of the busy events
    const freeBusy = [];
    // console.log(tempCalendars);

    // Iterate through all of the calendars
    for (const busy of Object.values(tempCalendars)) {
      // console.log(busy)

      // Iterate through all the busyArrays(list of events), and add them to the temp list
      for (const busyArray of Object.values(busy)) {
        // console.log(busyArray.length)

        // If the calendar has no events, we don't need to do anythin
        if (busyArray.length === 0) {
          // console.log("Array is empty!")
          //pass
        }

        // IF the calendar has events or an error, the length will be at least 1
        else {

          // If there is an error, don't add it to the list we send to cloud firestore
          if (busyArray[0].hasOwnProperty("domain") === true) {
            // pass
          }

          // NO error --> make a big array and send that to Cloud Firestore
          else {
            console.log("These items were pushed: ", busyArray);
            freeBusy.push.apply(freeBusy, busyArray);
          }


        }
      }
    }
    console.log("There should be 9 events in here");
    console.log(freeBusy);

    // === HARDCODING Room Id and User Id for testing purposes === //
    const roomid = "R307ZW3qDQaxA1V5fUz4";
    const userid = "a0wgKgLrw9dudbAJzdBl5yNQ6cH2";
    //Sends data to write to firestore
    this.updateRoomData(roomid, userid, freeBusy)

  }


 // Translates calenders into calendar Ids
  async getCalendars() {
    const calendars = await gapi.client.calendar.calendarList.list({});
    this.calendarList = calendars.result.items;

    // Creating a temporary variable to get list of Ids
    let calendarIds = [];

    // Filtering out the ids from the list of calendars
    this.calendarList.map((calendar, index) => {
      calendarIds.push(calendar.id);
    });

    // Assigning the temp calendarIds list to this.calendarIds
    // So that the rest of the service can access the data
    this.calendarIds = calendarIds;

  }

  async insertEvent() {
    const insert = await gapi.client.calendar.events.insert({
      calendarId: 'primary',
      start: {
        dateTime: hoursFromNow(2),
        timeZone: 'America/Los_Angeles'
      },
      end: {
        dateTime: hoursFromNow(3),
        timeZone: 'America/Los_Angeles'
      },
      summary: 'Have Fun!!!',
      description: 'Do some cool stuff and have a fun time doing it'
    })

    await this.getEvents();
  }

  // PUSHING DATA to cloud firestore --> should convert to a function that can be called
  // NEED to know which room and which user
  private updateRoomData(roomid, userid, freeBusy) {
    console.log("in updateRoomData function")
    // Setting a reference
    const roomRef: AngularFirestoreDocument = this.afs.doc(`rooms/${roomid}/`);

    // === POTENTIAL OPTIMIZATION === //
    // Wasn't sure how to create this structure in a model
    const userCalendar = {}
    userCalendar[userid] = {
      freeBusy
    }

    roomRef.set(userCalendar, {merge:true})

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
    console.log("Saving to cloud firestore hehe")
    console.log(data)
    return userRef.set(data, {merge: true});
  }


}

const hoursFromNow = (n) => new Date(Date.now() + n * 1000 * 60 * 60 ).toISOString();
