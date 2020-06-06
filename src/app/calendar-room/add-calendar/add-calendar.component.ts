import { Component, Inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  ValidatorFn,
} from "@angular/forms";
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from "@angular/material/dialog";

@Component({
  selector: "app-add-calendar",
  templateUrl: "./add-calendar.component.html",
  styleUrls: ["./add-calendar.component.scss"],
})
export class AddCalendarComponent implements OnInit {
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
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

  submit() {
    const selectedOrderIds = this.form.value.orders
      .map((v, i) => (v ? this.data.calendars[i].id : null))
      .filter((v) => v !== null);
    console.log(selectedOrderIds);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
