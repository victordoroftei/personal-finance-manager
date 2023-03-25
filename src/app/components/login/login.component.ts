import { Component } from '@angular/core';
import {UserService} from "../../services/user-service";
import {Router} from "@angular/router";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import jwtDecode from "jwt-decode";

export interface JWTPayload {
  exp: number;
  iat: number;
  iss: string;
  scope: string;
  sub: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private userService: UserService, private router: Router) {

  }

  loginForm = new FormGroup({
    emailAddress: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  showEmailAddressError = false;
  showPasswordError = false;
  isLoading = false;
  responseError = null;

  get emailAddress() {
    return this.loginForm.get('input-email-address');
  }

  get password() {
    return this.loginForm.get('input-password');
  }

  onSubmit(form: FormGroup) {
    const email = form.value.emailAddress;
    const password = form.value.password;

    this.showEmailAddressError = false;
    this.showPasswordError = false;
    this.responseError = null;

    if (email == null || email == "") {
      this.showEmailAddressError = true;
    }

    if (password == null || password == "") {
      this.showPasswordError = true;
    }

    if (!this.showEmailAddressError && !this.showPasswordError) {
      this.isLoading = true;
      this.userService.login(email, password).subscribe(() => {
          this.isLoading = false;
          this.responseError = null;
          const token = localStorage.getItem("token");
          const payload = jwtDecode(token!) as JWTPayload;

          if (payload.scope === "ROLE_ADMIN") {
            this.router.navigate(["/main-view/main-page"]);
          }
        },
        error => {
          this.responseError = error.error;
          this.isLoading = false;
        });
      form.reset();
    }
  }

  createAccount() {
    this.router.navigate(["/register"]);
  }

}
