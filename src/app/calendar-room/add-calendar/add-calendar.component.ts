import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormArray, FormControl } from "@angular/forms";
import { startOfDay, endOfDay, addWeeks } from "date-fns";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { CalendarService } from "../../services/calendar.service";
import { GoogleCalendarService } from "../../services/google-calendar.service";
import { GraphService } from "../../services/graph.service";
@Component({
  selector: "app-add-calendar",
  templateUrl: "./add-calendar.component.html",
  styleUrls: ["./add-calendar.component.scss"],
})
export class AddCalendarComponent implements OnInit {
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private gcal: GoogleCalendarService,
    private calendar: CalendarService,
    private graph: GraphService,
    public dialogRef: MatDialogRef<AddCalendarComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.formBuilder.group({
       g_calendar: new FormArray([]),
       ms_calendar: new FormArray([]),
     });
  }

  ngOnInit(): void {
    this.addCheckboxes();
  }

  private addCheckboxes() {
    this.data.googleCal.forEach((o, i) => {
      const g_calendar = new FormControl(i === 0); // if first item set to true, else false
      (this.form.controls.g_calendar as FormArray).push(g_calendar);
    });
    this.data.microsoftCal.forEach((o, i) => {
      const ms_calendar = new FormControl(i === 0); // if first item set to true, else false
      (this.form.controls.ms_calendar as FormArray).push(ms_calendar);
    });
  }

  getGCalControls() {
    return (this.form.get("g_calendar") as FormArray).controls;
  }

  getMsCalControls(){
    return (this.form.get("ms_calendar") as FormArray).controls;
  }

  async submit() {
    let gBusyTimes = [];
    let msBusyTimes = [];

    const g_items = this.form.value.g_calendar
      .map((v, i) => (v ? { id: this.data.googleCal[i].id } : null))
      .filter((v) => v !== null);

    const ms_items = this.form.value.ms_calendar
      .map((v, i) => (v ? { id: this.data.microsoftCal[i].id } : null))
      .filter((v) => v !== null);

    // Coogle Cal API Call
    const gEvents = await this.gcal.freebusy(
      g_items,
      startOfDay(new Date()),
      addWeeks(endOfDay(new Date()), 2)
    );

    console.log(g_items)
    console.log(ms_items)

    if (g_items.length > 0) {
      for (let [key, value] of Object.entries(gEvents.result.calendars)) {
        gBusyTimes.push(...value["busy"]);
      }
      this.calendar.addBusyTimes(gBusyTimes, this.data.calID, "gc_events");
    }
    if (ms_items.length > 0) {
      // Microsoft Graph API calls
      for (let i = 0; i < ms_items.length; i++) {
        const msEvents = await this.graph.getEvents(ms_items[i].id);
        msEvents.forEach((msEvent) => {
          let tempEvent = {
            'title': msEvent.subject,
            'description': msEvent.bodyPreview,
            'start': msEvent.start.dateTime + 'z',
            'end': msEvent.end.dateTime + 'z'
          }
          msBusyTimes.push(tempEvent)
        })
      }
      this.calendar.addBusyTimes(msBusyTimes, this.data.calID, "ms_events");
    }
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
