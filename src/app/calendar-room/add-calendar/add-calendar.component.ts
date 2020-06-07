import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormArray, FormControl } from "@angular/forms";
import { startOfDay, endOfDay, addWeeks } from "date-fns";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { AuthService } from "../../services/auth.service";
import { CalendarService } from "../../services/calendar.service";

@Component({
  selector: "app-add-calendar",
  templateUrl: "./add-calendar.component.html",
  styleUrls: ["./add-calendar.component.scss"],
})
export class AddCalendarComponent implements OnInit {
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private calendar: CalendarService,
    public dialogRef: MatDialogRef<AddCalendarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.formBuilder.group({
      orders: new FormArray([]),
    });
  }

  ngOnInit(): void {
    this.addCheckboxes();
  }

  getControls() {
    return (this.form.get("orders") as FormArray).controls;
  }

  private addCheckboxes() {
    this.data.calendars.forEach((o, i) => {
      const control = new FormControl(i === 0); // if first item set to true, else false
      (this.form.controls.orders as FormArray).push(control);
    });
  }

  async submit() {
    let busyTimes = [];
    const items = this.form.value.orders
      .map((v, i) => (v ? { id: this.data.calendars[i].id } : null))
      .filter((v) => v !== null);
    const data = await this.auth.freebusy(
      items,
      startOfDay(new Date()),
      addWeeks(endOfDay(new Date()), 2)
    );
    for (let [key, value] of Object.entries(data.result.calendars)) {
      busyTimes.push(...value["busy"]);
    }
    this.calendar.addBusyTimes(busyTimes, this.data.calID);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
