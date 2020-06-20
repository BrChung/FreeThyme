import {
  Component,
  Inject,
  OnInit,
  OnDestroy,
  EventEmitter,
} from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormArray,
  FormControl,
  Validators,
  AbstractControl,
  ValidatorFn,
} from "@angular/forms";
import {
  startOfDay,
  endOfDay,
  format,
  addMinutes,
  isSameDay,
  roundToNearestMinutes,
  differenceInMinutes,
  endOfToday,
  parse,
} from "date-fns";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { CalendarService } from "../../services/calendar.service";
import { Subscription } from "rxjs";
import { debounceTime, tap } from "rxjs/operators";

@Component({
  selector: "app-add-event",
  templateUrl: "./add-event.component.html",
  styleUrls: ["./add-event.component.scss"],
})
export class AddEventComponent implements OnInit, OnDestroy {
  form: FormGroup;
  formSub: Subscription;
  startTimeOptions: string[] = this.generateTimes();
  endTimeOptions: string[] = this.generateTimes();
  refresh = new EventEmitter();
  today: Date = new Date();
  constructor(
    private formBuilder: FormBuilder,
    private calendar: CalendarService,
    public dialogRef: MatDialogRef<AddEventComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.formBuilder.group({
      title: ["", [Validators.required]],
      startDate: ["", [Validators.required]],
      startTime: [
        "",
        [
          Validators.required,
          Validators.pattern("(1[0-2]|0?[1-9]):([0-5][0-9])(\\s*)([AP]M)$"),
        ],
      ],
      endDate: ["", [Validators.required]],
      endTime: [
        "",
        [
          Validators.required,
          Validators.pattern("(1[0-2]|0?[1-9]):([0-5][0-9])(\\s*)([AP]M)$"),
        ],
      ],
      description: ["", []],
      location: ["", []],
    });
  }

  ngOnInit(): void {
    this.formSub = this.form.valueChanges
      .pipe(debounceTime(500))
      .subscribe((value) => {
        this.form.controls["endDate"].setValidators([
          Validators.required,
          ValidateEndDate(this.form.value.startDate),
        ]);
        this.form.controls["endTime"].setValidators([
          Validators.required,
          Validators.pattern("(1[0-2]|0?[1-9]):([0-5][0-9])(\\s*)([AP]M)$"),
          ValidateEndTime(
            parse(this.form.value.endTime, "h':'mma", this.form.value.endDate),
            this.form.value.endDate
          ),
        ]);
        this.form.controls["endDate"].updateValueAndValidity({
          emitEvent: false,
        });
        this.form.controls["endTime"].updateValueAndValidity({
          emitEvent: false,
        });
        this.endTimeOptions = this.generateTimes(
          parse(value.startTime, "h':'mma", value.startDate),
          value.endDate
        );
        if (this.form.status == "VALID") {
          this.data.event.title = value.title;
          this.data.event.start = parse(
            this.form.value.startTime,
            "h':'mma",
            this.form.value.startDate
          );
          this.data.event.end = parse(
            this.form.value.endTime,
            "h':'mma",
            this.form.value.endDate
          );
          this.refresh.emit(null);
        }
      });
    this.form.patchValue({
      startDate: startOfDay(this.data.event.start),
      startTime: format(this.data.event.start, "h':'mma"),
      endDate: this.data.event.end
        ? startOfDay(this.data.event.end)
        : startOfDay(this.data.event.start),
      endTime: this.data.event.end
        ? format(this.data.event.end, "h':'mma")
        : format(addMinutes(this.data.event.start, 30), "h':'mma"),
    });
  }

  ngOnDestroy(): void {
    this.formSub.unsubscribe();
  }

  get title() {
    return this.form.get("title");
  }
  get description() {
    return this.form.get("description");
  }
  get startTime() {
    return this.form.get("startTime");
  }
  get endTime() {
    return this.form.get("endTime");
  }
  get startDate() {
    return this.form.get("startDate");
  }
  get endDate() {
    return this.form.get("endDate");
  }
  get location() {
    return this.form.get("location");
  }

  async submit() {
    const form = this.form.value;
    await this.calendar.addEvent(
      this.data.calID,
      form.title,
      parse(form.startTime, "h':'mma", form.startDate),
      parse(form.endTime, "h':'mma", form.endDate),
      form.description,
      form.location
    );
    this.dialogRef.close();
  }

  unFocusHandler(e, type) {
    if (type == "start") {
      const time = this.formatTime(this.form.value.startTime);
      this.form.controls["startTime"].setValue(time, { emitEvent: false });
    } else if (type == "end") {
      var time = this.formatTime(this.form.value.endTime);
      const startTime = parse(
        this.form.value.startTime,
        "h':'mma",
        this.form.value.startDate
      );
      if (this.form.value.endDate === "") return;
      const endTime = parse(time, "h':'mma", this.form.value.endDate);
      if (startTime > endTime) {
        time = format(
          addMinutes(
            parse(
              this.form.value.startTime,
              "h':'mma",
              this.form.value.startDate
            ),
            60
          ),
          "h':'mma"
        );
      }
      this.form.controls["endTime"].setValue(time, { emitEvent: false });
    }
  }

  formatTime(time: string) {
    if (!time) return "";
    var matches = time
      .toLowerCase()
      .match(/(1[0-2]|0?[1-9]):?([0-5][0-9])?(\s*)?([ap]m)?/);
    return (
      (matches[1] ? matches[1] : "12") +
      ":" +
      (matches[2] ? matches[2] : "00") +
      (matches[4] == "pm" ? "PM" : "AM")
    );
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  generateTimes(startTime?: Date, endDate?: Date, interval = 15) {
    let times = [];
    if (isSameDay(startTime, endDate)) {
      let time = roundToNearestMinutes(startTime, { nearestTo: 15 });
      let count = 0;
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
        time = addMinutes(time, interval);
      }
    }
    return times;
  }
}

function ValidateEndDate(startDate: Date): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (control.value && control.value < startDate) {
      return { endDateInvalid: true };
    }
    return null;
  };
}

function ValidateEndTime(startTime: Date, endDate: Date): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const endTime = parse(control.value, "h':'mma", endDate);
    if (control.value && endTime < startTime) {
      return { endTimeInvalid: true };
    }
    return null;
  };
}
