import { Component, Inject, OnInit } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  Validators,
} from "@angular/forms";
import {
  startOfDay,
  endOfDay,
  format,
  addMinutes,
  isSameDay,
  roundToNearestMinutes,
  differenceInMinutes,
} from "date-fns";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { CalendarService } from "../../services/calendar.service";

@Component({
  selector: "app-add-event",
  templateUrl: "./add-event.component.html",
  styleUrls: ["./add-event.component.scss"],
})
export class AddEventComponent implements OnInit {
  form: FormGroup;
  option: string[] = ["12:00am"];
  constructor(
    private formBuilder: FormBuilder,
    private calendar: CalendarService,
    public dialogRef: MatDialogRef<AddEventComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.formBuilder.group({
      title: ["", [Validators.required]],
      startDate: [[], [Validators.required]],
      startTime: [[], [Validators.required]],
      endDate: [[], [Validators.required]],
      endTime: [[], [Validators.required]],
      description: ["", []],
      location: ["", []],
    });
  }

  ngOnInit(): void {
    console.log(
      this.generateTimes(new Date(2020, 12, 1, 12, 30), new Date(2020, 12, 1))
    );
  }

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

  generateTimes(startTime?: Date, endDate?: Date, interval = 15) {
    let times = [];
    let count = 0;
    if (isSameDay(startTime, endDate)) {
      let time = roundToNearestMinutes(startTime, { nearestTo: 15 });
      const end = endOfDay(startTime);
      while (time < end) {
        const minDiff = differenceInMinutes(time, startTime);
        const timeDiff =
          minDiff < 60
            ? minDiff + " min" + (minDiff === 1 ? "" : "s")
            : Math.round((minDiff / 60 + Number.EPSILON) * 10) / 10 +
              " hr" +
              (minDiff / 60 === 1 ? "" : "s");
        if (minDiff > 0) {
          times.push(format(time, `h':'mma '(${timeDiff})'`));
        }
        count++;
        if (count <= 4) {
          time = addMinutes(time, interval);
        } else {
          time = addMinutes(time, interval * 2);
        }
      }
    } else {
      let time = startOfDay(new Date());
      const end = endOfDay(new Date());
      while (time < end) {
        times.push(format(time, "h':'mma"));
        count++;
        if (count <= 4) {
          time = addMinutes(time, interval);
        } else {
          time = addMinutes(time, interval * 2);
        }
      }
    }
    return times;
  }
}
