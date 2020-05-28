import { Component, OnInit } from "@angular/core";
import { AuthService } from "../services/auth.service";

@Component({
  selector: "app-playground",
  templateUrl: "./playground.component.html",
  styleUrls: ["./playground.component.scss"],
})
export class PlaygroundComponent implements OnInit {
  constructor(public auth: AuthService) {}

  ngOnInit(): void {}
}
