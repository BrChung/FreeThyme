import { Component, OnInit } from "@angular/core";
import { AuthService } from "../../services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-login-page",
  templateUrl: "./login-page.component.html",
  styleUrls: ["./login-page.component.scss"],
})
export class LoginPageComponent implements OnInit {
  linkedToMicrosoft: boolean = false;
  linkedToGoogle: boolean = false;

  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.getLinked();
  }

  async getLinked() {
    this.linkedToMicrosoft = await this.auth.isLinkedWithMicrosoft();
    this.linkedToGoogle = await this.auth.isLinkedWithGoogle();
  }

  async googleSignIn() {
    const user = await this.auth.googleSignIn();
    if (user) this.router.navigate(["/home/cal"]);
  }
}
