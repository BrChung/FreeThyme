import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from "@angular/router";
import { AuthSnackbarService } from "../services/auth-snackbar.service";
import { AuthService } from "../services/auth.service";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private snack: AuthSnackbarService,
    private router: Router
  ) {}

  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean> {
    const user = await this.auth.getCurrentUser();
    const isLoggedIn = !!user;
    if (!isLoggedIn) {
      this.router.navigate(["/login"]);
      this.snack.authError();
    }
    return isLoggedIn;
  }
}
