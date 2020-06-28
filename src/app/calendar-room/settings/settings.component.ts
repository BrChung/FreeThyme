import { Component, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { CalendarService } from "../../services/calendar.service";
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  Validators,
  AbstractControl,
  ValidatorFn,
} from "@angular/forms";
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  form: FormGroup

  constructor(
    private formBuilder: FormBuilder,
    private calendar: CalendarService,
    public dialogRef: MatDialogRef<SettingsComponent>,
  ) { }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      unknown: []
    })
  }


  async submit() {
    this.dialogRef.close();
  }
}
