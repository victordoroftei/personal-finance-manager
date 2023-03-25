import { Component } from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";

@Component({
  selector: 'app-manage-account-dialog',
  templateUrl: './manage-account-dialog.component.html',
  styleUrls: ['./manage-account-dialog.component.css']
})
export class ManageAccountDialogComponent {

  constructor(private _dialogRef: MatDialogRef<ManageAccountDialogComponent>, private router: Router) {

  }

  ngOnInit(): void {

  }

  onClose() {
    this._dialogRef.close();
    this.router.navigate(["/main-view/main-page"]);
  }

}
