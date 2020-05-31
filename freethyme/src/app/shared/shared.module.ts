import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { NbCardModule, NbButtonModule, NbIconModule } from "@nebular/theme";

import { NbEvaIconsModule } from "@nebular/eva-icons";
import { EllipsisModule } from "ngx-ellipsis";
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
];

@NgModule({
  declarations: [...components],
  imports: [...modules],
  exports: [...components, ...modules],
})
export class SharedModule {}
