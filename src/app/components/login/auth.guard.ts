import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {LoginService} from "../../services/login-service";
import {map, Observable, take} from "rxjs";
import jwtDecode from "jwt-decode";
import {JWTPayload} from "./login.component";

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {

  constructor(private loginService: LoginService, private router: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.loginService.loggedUser.pipe(take(1), map(user => {
      const isAuth = !!user;

      if (isAuth) {
        const payload = jwtDecode(user.token!) as JWTPayload;

        if (payload.scope === "ROLE_ADMIN") {
          return true;
        }
      }
      return this.router.createUrlTree(["/login"]);
    }));
  }
}
