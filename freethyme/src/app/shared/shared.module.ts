import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NbCardModule, NbButtonModule } from "@nebular/theme";

const components = [];

const modules = [CommonModule, NbCardModule, NbButtonModule];

@NgModule({
  declarations: [...components],
  imports: [...modules],
  exports: [...components, ...modules],
})
export class SharedModule {}
