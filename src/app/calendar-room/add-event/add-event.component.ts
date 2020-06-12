import { Component, Inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  Validators,
} from "@angular/forms";
import { startOfDay, endOfDay, addWeeks } from "date-fns";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { CalendarService } from "../../services/calendar.service";

@Component({
  selector: "app-add-event",
  templateUrl: "./add-event.component.html",
  styleUrls: ["./add-event.component.scss"],
})
export class AddEventComponent implements OnInit {
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private calendar: CalendarService,
    public dialogRef: MatDialogRef<AddEventComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.formBuilder.group({
      title: ["General", [Validators.required]],
      start: [1, [Validators.required]],
      end: [0, [Validators.required]],
      description: ["", []],
      location: ["", []],
    });
  }

  ngOnInit(): void {}

  get title() {
    return this.form.get("title");
  }
  get description() {
    return this.form.get("description");
  }
  get start() {
    return this.form.get("start");
  }
  get end() {
    return this.form.get("end");
  }
  get location() {
    return this.form.get("location");
  }

  async submit() {
    console.log("hi");
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
