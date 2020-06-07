import { Component, OnInit, OnDestroy, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { CalendarService } from "../../../services/calendar.service";
import { map, take, debounceTime, flatMap, switchMap } from "rxjs/operators";
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
} from "@angular/forms";
import { AngularFirestore } from "@angular/fire/firestore";

@Component({
  selector: "app-share-invite-members",
  templateUrl: "./share-invite-members.component.html",
  styleUrls: ["./share-invite-members.component.scss"],
})
export class ShareInviteMembersComponent implements OnInit, OnDestroy {
  members$: any;
  shareLink: string;
  emailForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<ShareInviteMembersComponent>,
    private calendar: CalendarService,
    private afs: AngularFirestore,
    private fb: FormBuilder,

    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.members$ = this.calendar.getMembers(this.data.calID);
    this.shareLink = "https://freethyme-269222.web.app/cal/" + this.data.calID;
    this.emailForm = this.fb.group({
      email: [
        [],
        [Validators.required, Validators.email],
        EmailValidator.Email(this.afs),
      ],
    });
  }

  ngOnDestroy(): void {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  get email() {
    return this.emailForm.get("email");
  }

  addMember() {
    this.afs
      .collection("users", (ref) =>
        ref.where("email", "==", this.emailForm.value.email)
      )
      .valueChanges()
      .pipe(take(1))
      .subscribe((user) => {
        this.afs
          .collection(`rooms/${this.data.calID}/members`, (ref) =>
            ref.where("uid", "==", user[0]["uid"])
          )
          .valueChanges()
          .pipe(take(1))
          .subscribe((member) => {
            if (member.length == 0) {
              this.calendar.setMember(
                this.data.calID,
                user[0]["uid"],
                user[0]["displayName"],
                "member"
              );
              this.dialogRef.close();
            } else {
              console.log("member already exists in the room!");
            }
          });
      });
  }
}

export class EmailValidator {
  static Email(afs: AngularFirestore) {
    return (control: AbstractControl) => {
      const email = control.value.toLowerCase();
      return afs
        .collection("users", (ref) => ref.where("email", "==", email))
        .valueChanges()
        .pipe(
          debounceTime(1000),
          take(1),
          map((arr) => (!arr.length ? { emailExists: false } : null))
        );
    };
  }
}
