import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {RegisterService} from "../../services/register-service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {RegisterDialogComponent} from "./register-dialog/register-dialog.component";

export interface DialogData {
  message: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent {

  constructor(private registerService: RegisterService, private router: Router, public dialog: MatDialog) {

  }

  openDialog(): void {
    const dialogRef = this.dialog.open(RegisterDialogComponent, {
      data: {string: "Account has been successfully created!"}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("Dialog closed");
    });
  }

  emailPattern(email: string) {
    return RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}').test(email);
  }

  registerForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  showFirstNameError = false;
  showLastNameError = false;
  showEmailAddressError = false;
  showUsedEmailAddressError = false
  showPasswordError = false;
  showPasswordsUnmatch = false;
  showConfirmPasswordError = false;
  isLoading = false;

  onSubmit(form: FormGroup) {
    const firstName = form.value.firstName;
    const lastName = form.value.lastName;
    const email = form.value.email;
    const password = form.value.password;
    const confirmPassword = form.value.confirmPassword;

    this.showFirstNameError = false;
    this.showLastNameError = false;
    this.showEmailAddressError = false;
    this.showUsedEmailAddressError = false;
    this.showPasswordError = false;
    this.showPasswordsUnmatch = false;
    this.showConfirmPasswordError = false;

    if (firstName == null || firstName == "") {
      this.showFirstNameError = true;
    }

    if (lastName == null || lastName == "") {
      this.showLastNameError = true;
    }

    if (!(email == null || email == "" || !this.emailPattern(email))) {
    } else {
      this.showEmailAddressError = true;
    }

    if (password == null || password == "" || password.length < 8) {
      this.showPasswordError = true;
    }

    if (password != confirmPassword) {
      this.showPasswordsUnmatch = true;
    }

    if (confirmPassword == null || confirmPassword == "") {
      this.showConfirmPasswordError = true;
    }

    if (!this.showFirstNameError &&
      !this.showLastNameError &&
      !this.showEmailAddressError &&
      !this.showPasswordError &&
      !this.showConfirmPasswordError &&
      !this.showPasswordsUnmatch) {

        this.isLoading = true;
        this.registerService.register(firstName, lastName, email, password).subscribe(() => {
            this.isLoading = false;
            this.openDialog();
            //this.router.navigate(["/login"]);
          },
          error => {
            let errors = error.error;

            if (errors.includes("first name")) {
              this.showFirstNameError = true;
            }
            if (errors.includes("last name")) {
              this.showLastNameError = true;
            }
            if (errors.includes("password")) {
              this.showPasswordError = true;
            }
            if (errors.includes("email")) {
              this.showEmailAddressError = true;
            }
            if (errors.includes("already used")) {
              this.showUsedEmailAddressError = true;
            }

            this.isLoading = false;
          });
        }
  }

  login() {
    this.router.navigate(["/login"])
  }
}
