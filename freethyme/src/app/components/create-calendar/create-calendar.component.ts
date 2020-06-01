import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-create-calendar",
  templateUrl: "./create-calendar.component.html",
  styleUrls: ["./create-calendar.component.scss"],
})
export class CreateCalendarComponent implements OnInit {
  form: FormGroup;
  colors = ["gray", "#3D94C7", "green", "yellow", "red", "purple"];
  meetingTypes = [
    { value: "general", viewValue: "General" },
    { value: "meetup", viewValue: "Meet Up" },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ["", [Validators.required]],
      description: ["", []],
      color: ["#3D94C7", [Validators.required]],
      type: ["", [Validators.required]],
      hours: ["", [Validators.required]],
      mins: ["", [Validators.required]],
    });
  }

  //Form getters for form content
  get title() {
    return this.form.get("title");
  }
  get description() {
    return this.form.get("description");
  }
  get color() {
    return this.form.get("color");
  }
  get type() {
    return this.form.get("type");
  }
  get hours() {
    return this.form.get("hours");
  }
  get mins() {
    return this.form.get("mins");
  }

  onSubmit() {
    console.log(this.form);
  }
}
