import {
  Component,
  Output,
  EventEmitter,
  ViewChild,
  Renderer2,
  AfterViewInit,
} from "@angular/core";
import { subDays, addDays } from "date-fns";
import { MatCalendar } from "@angular/material/datepicker";

@Component({
  selector: "app-month-calendar",
  templateUrl: "./month-calendar.component.html",
  styleUrls: ["./month-calendar.component.scss"],
})
export class MonthCalendarComponent implements AfterViewInit {
  @Output()
  dateSelected: EventEmitter<Date> = new EventEmitter();

  @Output()
  selectedDate = new Date();

  @ViewChild("calendar")
  calendar: MatCalendar<Date>;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit() {
    const buttons = document.querySelectorAll(
      ".mat-calendar-previous-button, .mat-calendar-next-button"
    );

    if (buttons) {
      Array.from(buttons).forEach((button) => {
        this.renderer.listen(button, "click", () => {
          console.log("Arrow buttons clicked");
        });
      });
    }
  }

  monthSelected(date: Date) {
    console.log("month changed");
  }

  dateChanged() {
    this.calendar.activeDate = this.selectedDate;
    this.dateSelected.emit(this.selectedDate);
  }

  prevDay() {
    const prevDay = subDays(this.selectedDate, 1);
    this.selectedDate = prevDay;
    this.dateChanged();
  }

  today() {
    this.selectedDate = new Date();
    this.dateChanged();
  }

  nextDay() {
    const nextDay = addDays(this.selectedDate, 1);
    this.selectedDate = nextDay;
    this.dateChanged();
  }
}
