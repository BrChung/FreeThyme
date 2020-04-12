import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { RoomService } from './room.service';

declare var gapi: any;

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  calendarItems: any[];
  calendarList: any[];
  calendarIds: any[];

  constructor(public afs: AngularFirestore, public authService: AuthService, public roomService: RoomService) { }

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
      // Iterate through all the busyArrays(list of events), and add them to the temp list
      for (const busyArray of Object.values(busy)) {
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
    console.log("user id:", this.authService.userId)
    //Sends data to write to firestore
    this.roomService.updateRoomData(freeBusy)
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

   // async insertEvent() {
   //   const insert = await gapi.client.calendar.events.insert({
   //     calendarId: 'primary',
   //     start: {
   //       dateTime: hoursFromNow(2),
   //       timeZone: 'America/Los_Angeles'
   //     },
   //     end: {
   //       dateTime: hoursFromNow(3),
   //       timeZone: 'America/Los_Angeles'
   //     },
   //     summary: 'Have Fun!!!',
   //     description: 'Do some cool stuff and have a fun time doing it'
   //   })
   //
   //   await this.getEvents();
   // }

}
