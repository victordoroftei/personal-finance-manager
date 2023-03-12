import {Injectable} from '@angular/core';
import {BehaviorSubject, tap} from "rxjs";
import {LoggedInUserModel} from "../models/logged-in-user.model";
import {HttpClient, HttpHeaders, HttpResponse} from "@angular/common/http";
import {Router} from "@angular/router";
import {JWTPayload} from "../components/login/login.component";
import jwtDecode from "jwt-decode";

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  loggedUser = new BehaviorSubject<LoggedInUserModel>(null!);

  loginUrl: string = "http://localhost:8080/login";

  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router) {

  }

  login(email: string, password: string) {
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Authorization": "Basic " + btoa(email + ":" + password)
      }),
      observe: "response" as "body"
    };

    return this.http.post<HttpResponse<any>>(this.loginUrl, null, httpOptions).pipe(tap(responseData => {
      const authHeader = String(String(responseData.headers.get("Authorization")) || '');

      if (authHeader.startsWith("Bearer ")) {
        const token = authHeader.substring(7, authHeader.length);
        const payload = jwtDecode(token) as JWTPayload;

        this.handleAuthentication(token, payload.exp - payload.iat);
      }
    }))
  }

  private handleAuthentication(token: string, expiresIn: number) {
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const loggedUser = new LoggedInUserModel(token, expirationDate);

    this.loggedUser.next(loggedUser);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem("token", token);
  }

  autoLogin() {
    const token = localStorage.getItem("token")!;

    if (!token) {
      return;
    }
    const payload = jwtDecode(token) as JWTPayload;
    const tokenExpiresIn = payload.exp - payload.iat;
    const tokenExpirationDate = new Date(new Date().getTime() + tokenExpiresIn * 1000);
    const loadedUser = new LoggedInUserModel(token, tokenExpirationDate);

    if (loadedUser.token) {
      this.loggedUser.next(loadedUser);
      const expirationDuration = tokenExpirationDate.getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
    }
  }

  logout() {
    this.loggedUser.next(null!);
    this.router.navigate(["/login"])
      .then(() => {
        window.location.reload();
      });
    localStorage.removeItem("token");

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
        this.logout();
      },
      expirationDuration);
  }
}
