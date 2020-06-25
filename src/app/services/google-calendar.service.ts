import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";

// Declare Google API Client var (set on index.html)
declare var gapi: any;

@Injectable({
  providedIn: "root",
})
export class GoogleCalendarService {
  constructor() {
    this.initGapiClient();
  }

  // Initialize the Google API client with desired scopes
  initGapiClient() {
    gapi.load("client", () => {
      gapi.client.init(environment.googleCal);
      gapi.client.load("calendar", "v3");
    });
  }

  async freebusy(items: Array<any>, timeMin: Date = new Date(), timeMax: Date) {
    return await gapi.client.calendar.freebusy.query({
      items,
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
    });
  }

  async getEvents(calID: string, timeMin: Date = new Date(), timeMax: Date) {
    return await gapi.client.calendar.events.list({
      calendarId: calID,
      timeMin: timeMin.toISOString(),
      timeMax: timeMax.toISOString(),
      singleEvents: true,
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
}

const hoursFromNow = (n) =>
  new Date(Date.now() + n * 1000 * 60 * 60).toISOString();
