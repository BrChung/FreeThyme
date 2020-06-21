import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";

@Injectable({
  providedIn: "root",
})
export class AuthSnackbarService {
  constructor(private snackBar: MatSnackBar) {}

  authError(message: string) {
    this.snackBar.open(message, "OK", {
      duration: 10000,
    });

    return this.snackBar._openedSnackBarRef.onAction().pipe().subscribe();
  }
}
