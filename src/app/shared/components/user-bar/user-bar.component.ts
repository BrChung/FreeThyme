import { Component, OnInit, Input } from "@angular/core";
import { Member } from "../../../models/member";

@Component({
  selector: "app-user-bar",
  templateUrl: "./user-bar.component.html",
  styleUrls: ["./user-bar.component.scss"],
})
export class UserBarComponent implements OnInit {
  @Input() userCount: number = 0;
  @Input() users: Array<Member>;
  @Input() userImg: any;

  constructor() {}

  ngOnInit(): void {
    if (this.userImg) {
      this.userImg = Object.assign({}, ...this.userImg);
    }
  }
}
