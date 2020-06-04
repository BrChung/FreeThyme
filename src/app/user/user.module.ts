import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoginPageComponent } from "./login-page/login-page.component";
import { UserRoutingModule } from "./user-routing.module";
import { SharedModule } from "../shared/shared.module";

@NgModule({
  declarations: [LoginPageComponent],
  imports: [CommonModule, UserRoutingModule, SharedModule],
})
export class UserModule {}
