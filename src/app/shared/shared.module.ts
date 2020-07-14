import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { EllipsisModule } from "ngx-ellipsis";
import { LayoutModule } from "@angular/cdk/layout";
import { ClipboardModule } from "@angular/cdk/clipboard";
import { MatRippleModule } from "@angular/material/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { MatStepperModule } from "@angular/material/stepper";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatButtonModule } from "@angular/material/button";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatCardModule } from "@angular/material/card";
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatTabsModule } from "@angular/material/tabs";
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatNativeDateModule } from "@angular/material/core";
import { MatIconModule } from "@angular/material/icon";
import { MatDividerModule } from "@angular/material/divider";
import { MatExpansionModule } from "@angular/material/expansion";
import { LayoutComponent } from "./layout/layout.component";
import { MonthCalendarComponent } from "./components/month-calendar/month-calendar.component";
import { UserBarComponent } from "./components/user-bar/user-bar.component";
import { ShareInviteMembersComponent } from "./components/share-invite-members/share-invite-members.component";

import { OutsideClickDirective } from "./outside-click.directive";
import { PreventDoubleClickDirective } from "./prevent-double-click.directive";

const components = [
  LayoutComponent,
  MonthCalendarComponent,
  UserBarComponent,
  ShareInviteMembersComponent,
  OutsideClickDirective,
  PreventDoubleClickDirective,
];

const modules = [
  CommonModule,
  RouterModule,
  EllipsisModule,
  MatRippleModule,
  FormsModule,
  ReactiveFormsModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatButtonToggleModule,
  MatIconModule,
  MatStepperModule,
  MatSnackBarModule,
  MatButtonModule,
  MatToolbarModule,
  LayoutModule,
  ClipboardModule,
  MatSidenavModule,
  MatListModule,
  MatMenuModule,
  MatCardModule,
  MatDialogModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatCheckboxModule,
  MatTabsModule,
  MatAutocompleteModule,
  MatSlideToggleModule,
  MatDividerModule,
  MatExpansionModule
];

@NgModule({
  declarations: [...components],
  imports: [...modules],
  exports: [...components, ...modules],
  providers: [
    {
      provide: MatDialogRef,
      useValue: {},
    },
    { provide: MAT_DIALOG_DATA, useValue: {} },
  ],
})
export class SharedModule {}
