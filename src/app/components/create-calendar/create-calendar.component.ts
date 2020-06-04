import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { CalendarService } from "../../services/calendar.service";

@Component({
  selector: "app-create-calendar",
  templateUrl: "./create-calendar.component.html",
  styleUrls: ["./create-calendar.component.scss"],
})
export class CreateCalendarComponent implements OnInit {
  calendarForm: FormGroup;
  meetingForm: FormGroup;
  colors = ["gray", "#3D94C7", "green", "yellow", "red", "purple"];
  hoursArr = Array(25)
    .fill(1)
    .map((x, i) => i);
  minsArr = [0, 15, 30, 45];
  meetingTypes = ["General", "Meet Up"];
  selectedMin = 0;
  selectedHour = 1;
  selectedMeeting = "General";

  constructor(
    private fb: FormBuilder,
    private calendarService: CalendarService
  ) {}

  ngOnInit(): void {
    this.calendarForm = this.fb.group({
      title: ["", [Validators.required]],
      description: ["", []],
      color: ["#3D94C7", [Validators.required]],
    });
    this.meetingForm = this.fb.group({
      type: ["", [Validators.required]],
      hours: ["", [Validators.required]],
      mins: ["", [Validators.required]],
    });
  }

  //Form getters for form content
  get title() {
    return this.calendarForm.get("title");
  }
  get description() {
    return this.calendarForm.get("description");
  }
  get color() {
    return this.calendarForm.get("color");
  }
  get type() {
    return this.meetingForm.get("type");
  }
  get hours() {
    return this.meetingForm.get("hours");
  }
  get mins() {
    return this.meetingForm.get("mins");
  }

  async onSubmit() {
    const data = { ...this.calendarForm.value, ...this.meetingForm.value };
    return this.calendarService.createRoom(data);
  }
}
