import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { NbCardModule, NbButtonModule } from "@nebular/theme";
import { HeaderComponent } from "./header/header.component";

const components = [HeaderComponent];

const modules = [CommonModule, NbCardModule, NbButtonModule, RouterModule];

@NgModule({
  declarations: [...components],
  imports: [...modules],
  exports: [...components, ...modules],
})
export class SharedModule {}
