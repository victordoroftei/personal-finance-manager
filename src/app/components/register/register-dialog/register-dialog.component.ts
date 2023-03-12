import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {DialogData} from "../register.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-register-dialog',
  templateUrl: './register-dialog.component.html',
  styleUrls: ['./register-dialog.component.css']
})
export class RegisterDialogComponent {

  constructor(public dialogRef: MatDialogRef<RegisterDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private router: Router) {

  }

  onOkClick(): void {
    this.dialogRef.close();
    this.router.navigate(["/login"]);
  }
}
