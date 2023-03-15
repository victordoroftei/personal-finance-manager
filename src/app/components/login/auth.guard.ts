import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {LoginService} from "../../services/login-service";
import {map, Observable, take} from "rxjs";

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {

  constructor(private loginService: LoginService, private router: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.loginService.loggedUser.pipe(take(1), map(user => {
      const isAuth = !!user;

      if (isAuth) {
        return true;
      }

      return this.router.createUrlTree(["/login"]);
    }));
  }
}
