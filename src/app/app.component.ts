import { Component, OnInit } from "@angular/core";
import { BroadcastService, MsalService } from "@azure/msal-angular";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  title = "freethyme";
  constructor(private msalService: MsalService) {}

  ngOnInit() {
    this.msalService.handleRedirectCallback((authError, response) => {
      if (authError) {
        console.error("Redirect Error: ", authError.errorMessage);
        return;
      }

      console.log("Redirect Success: ", response);
    });
  }
}
