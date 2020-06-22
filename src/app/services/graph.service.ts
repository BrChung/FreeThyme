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
        // Get the token from the auth service
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
  async getEvents(): Promise<Event[]> {
    // The only parameters we input are the startTime of the desired range and the endTime of the desired
    // Using the date-fns library to get today's date in ISO string and 2 weeks from today in ISO string
    let start = startOfDay(new Date())
    console.log(start, start.toISOString())

    try {
      let result = await this.graphClient
        .api(`/me/calendar/calendarView?startDateTime=${start.toISOString()}&endDateTime=${addWeeks(endOfDay(new Date()), 2).toISOString()}`)
        .get();
      return result.value;
    } catch (error) {
      console.log(error);
    }
  }
}
