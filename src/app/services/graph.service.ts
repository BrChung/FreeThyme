/*
  ASSUMPTIONS: A user is logged in through microsoft with a microsoft access token
  Purpose: Provide all the methods for getting events from a microsoft calendar
          To get a an event from a calendar, we need the calendar id
*/

import { Injectable, OnInit } from "@angular/core";
import { Client } from "@microsoft/microsoft-graph-client";
import { startOfDay, endOfDay, addWeeks } from "date-fns";

import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class GraphService implements OnInit {
  private graphClient: Client;
  constructor(private authService: AuthService) {
    // Initialize the Graph client
    this.graphClient = Client.init({
      authProvider: async (done) => {
        // Get the token from the auth service so we can make requests to the Microsoft Graph API
        let token = await this.authService.getAccessToken().catch((reason) => {
          done(reason, null);
        });
        if (token) {
          done(null, token);
        } else {
          done("Could not get an access token", null);
        }
      },
    });
  }

  ngOnInit() {}

  // Purpose: To get events on a given calendar
  async getEvents(msCalId, startDate, endDate): Promise<any> {
    // The only parameters we input are the startTime of the desired range and the endTime of the desired
    // Using the date-fns library to get today's date in ISO string and 2 weeks from today in ISO string
    try {
      let result = await this.graphClient
        .api(`/me/calendars/${msCalId}/calendarView?startDateTime=${startDate.toISOString()}&endDateTime=${endDate.toISOString()}`)
        .get();
      return result.value;
    } catch (error) {
      console.log(error);
    }
  }

  async getCalendars () {
    try {
      let result = await this.graphClient
        .api("/me/calendars").get()
      return result.value;
    }
    catch (error) {
      console.log(error)
    }
  }

}
