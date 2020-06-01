import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { NbCardModule, NbButtonModule, NbIconModule } from "@nebular/theme";
import { NbEvaIconsModule } from "@nebular/eva-icons";
import { EllipsisModule } from "ngx-ellipsis";
import { MatRippleModule } from "@angular/material/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";

import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatIconModule } from "@angular/material/icon";

import { HeaderComponent } from "./header/header.component";

const components = [HeaderComponent];

const modules = [
  CommonModule,
  NbCardModule,
  NbButtonModule,
  RouterModule,
  NbIconModule,
  NbEvaIconsModule,
  EllipsisModule,
  MatRippleModule,
  FormsModule,
  ReactiveFormsModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatButtonToggleModule,
  MatIconModule,
];

@NgModule({
  declarations: [...components],
  imports: [...modules],
  exports: [...components, ...modules],
})
export class SharedModule {}
