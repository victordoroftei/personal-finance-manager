import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from "@angular/router";
import {UserService} from "../../services/user-service";
import {map, Observable, take} from "rxjs";

@Injectable({providedIn: 'root'})
export class AuthGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.userService.loggedUser.pipe(take(1), map(user => {
      const isAuth = !!user;

      if (isAuth) {
        return true;
      }

      return this.router.createUrlTree(["/login"]);
    }));
  }
}
