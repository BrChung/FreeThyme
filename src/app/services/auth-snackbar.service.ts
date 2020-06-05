import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { tap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class AuthSnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  authError() {
    this.snackBar.open("You must be logged in!", "OK", {
      duration: 5000,
    });

    return this.snackBar._openedSnackBarRef.onAction().pipe().subscribe();
  }
}
