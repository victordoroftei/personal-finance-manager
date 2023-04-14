import { Component } from '@angular/core';
import {UserModel} from "../../../models/user.model";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {UserService} from "../../../services/user-service";
import {ManageAccountDialogComponent} from "./manage-account-dialog/manage-account-dialog.component";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-manage-account',
  templateUrl: './manage-account.component.html',
  styleUrls: ['./manage-account.component.css']
})
export class ManageAccountComponent {

  _userId!: number;
  _email!: string;
  _phoneNumber!: string;
  userUpdatedModel!: UserModel;

  constructor(private router: Router, private userService: UserService, private _dialogRef: MatDialog) {

  }

  updateAccountForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl({value: '', disabled: true}, [Validators.required]),
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
    phoneNumber: new FormControl({value: '', disabled: true}, [Validators.required])
  });

  showFirstNameError = false;

  showLastNameError = false;

  showPasswordError = false;

  showPasswordsUnmatch = false;

  showConfirmPasswordError = false;

  isLoading = false;

  ngOnInit(): void {
    this.userService.getUserById().subscribe(data => {
      let body = data.body;
      this.updateAccountForm.controls["firstName"].setValue(body.firstname);
      this.updateAccountForm.controls["lastName"].setValue(body.lastname);
      this.updateAccountForm.controls["email"].setValue(body.emailAddress);
      this.updateAccountForm.controls["phoneNumber"].setValue(body.phoneNumber);

      this._email = body.emailAddress;
      this._phoneNumber = body.phoneNumber;
    }, error => {
      alert("An error occurred while fetching the details of the client!");
    });
  }

  onSubmit(form: FormGroup) {
    const firstName = form.value.firstName;
    const lastName = form.value.lastName;
    const email = this._email;
    const password = form.value.password;
    const confirmPassword = form.value.confirmPassword;
    const phoneNumber = this._phoneNumber;

    this.showFirstNameError = false;
    this.showLastNameError = false;
    this.showPasswordError = false;
    this.showPasswordsUnmatch = false;
    this.showConfirmPasswordError = false;

    if (firstName === null || firstName === "") {
      this.showFirstNameError = true;
    }

    if (lastName === null || lastName === "") {
      this.showLastNameError = true;
    }

    if (password === null || password === "" || password.length < 8) {
      this.showPasswordError = true;
    }

    if (password !== confirmPassword) {
      this.showPasswordsUnmatch = true;
    }

    if (confirmPassword === null || confirmPassword === "") {
      this.showConfirmPasswordError = true;
    }

    if (!this.showFirstNameError &&
      !this.showLastNameError &&
      !this.showPasswordError &&
      !this.showConfirmPasswordError &&
      !this.showPasswordsUnmatch
    ) {

      this.isLoading = true;
      this.userUpdatedModel = new UserModel(this._userId, firstName, lastName, email, password, phoneNumber);
      this.userService.updateAccount(this.userUpdatedModel)
        .subscribe((response) => {
            if (response) {
              this.isLoading = false;
              this.openSuccessDialog();
              this.updateAccountForm.controls['password'].setValue('');
              this.updateAccountForm.controls['confirmPassword'].setValue('');
            }
          },
          (err: HttpErrorResponse) => {
            let errors = err.error;

            if (errors.includes("first name")) {
              this.showFirstNameError = true;
            }

            if (errors.includes("last name")) {
              this.showLastNameError = true;
            }

            if (errors.includes("password")) {
              this.showPasswordError = true;
            }

            this.isLoading = false;

          });
    }
  }

  openSuccessDialog() {
    this._dialogRef.open(ManageAccountDialogComponent);
  }

}
