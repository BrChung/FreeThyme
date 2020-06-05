import { Component } from "@angular/core";
import { slider, fader } from "./route-animation";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
  animations: [fader],
})
export class HomeComponent {
  constructor() {}
}
