import { Injectable, OnInit } from "@angular/core";
import { Client } from "@microsoft/microsoft-graph-client";

import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class GraphService implements OnInit {
  private graphClient: Client;
  constructor(private authService: AuthService) {
    console.log("i ran");
    // Initialize the Graph client
    let token = this.getAccessToken();
    console.log(token);
    this.graphClient = Client.init({
      authProvider: async (done) => {
        console.log("authprovider");
        // Get the token from the auth service
        let token = await this.authService.getAccessToken().catch((reason) => {
          done(reason, null);
        });
        console.log(token);
        if (token) {
          done(null, token);
        } else {
          done("Could not get an access token", null);
        }
      },
    });
    console.log(this.graphClient);
  }

  async getAccessToken() {
    const token = await this.authService.getAccessToken();
    return token;
  }

  ngOnInit() {}

  async getEvents(): Promise<Event[]> {
    try {
      let result = await this.graphClient
        .api("/me/events")
        .select("subject,organizer,start,end")
        .orderby("createdDateTime DESC")
        .get();

      return result.value;
    } catch (error) {
      console.log(error);
    }
  }
}
