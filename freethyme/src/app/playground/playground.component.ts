import { Component, OnInit } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { Member } from "../models/member";

@Component({
  selector: "app-playground",
  templateUrl: "./playground.component.html",
  styleUrls: ["./playground.component.scss"],
})
export class PlaygroundComponent implements OnInit {
  userExample: Array<Member>;
  images: any;

  constructor(public auth: AuthService) {}
  ngOnInit(): void {
    this.userExample = [
      {
        UID: "1234",
        nickname: "Brian Chung",
        role: "admin",
        combined: "2-Brian Chung",
      },
      { UID: "12345", nickname: "Jason", role: "owner", combined: "1-Jason" },
      { UID: "123456", nickname: "Blue", role: "viewer", combined: "4-Blue" },
      { UID: "1234", nickname: "Blue", role: "viewer", combined: "4-Blue" },
      { UID: "12345", nickname: "Blue", role: "viewer", combined: "4-Blue" },
      { UID: "12345", nickname: "Blue", role: "viewer", combined: "4-Blue" },
      { UID: "12345", nickname: "Blue", role: "viewer", combined: "4-Blue" },
    ];
    this.images = {
      "1234":
        "https://lh3.googleusercontent.com/a-/AOh14Ghg14msqh6WPzIqGc67YHhGegBNdzJszhBWP_yJ4w=s96-c",
      "12345":
        "https://lh3.googleusercontent.com/a-/AOh14GhFTj5s0Xz4SjROR5gEQpfff50esTzJDT-LGM7YVg=s96-c",
    };
  }
}
