import { Component, OnInit, Input } from "@angular/core";
import { Member } from "../../models/member";

@Component({
  selector: "app-user-bar",
  templateUrl: "./user-bar.component.html",
  styleUrls: ["./user-bar.component.scss"],
})
export class UserBarComponent implements OnInit {
  @Input() userCount: number;
  @Input() users: Array<Member>;

  constructor() {}

  ngOnInit(): void {}
}
