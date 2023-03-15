import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";

export interface DialogData {
  message: string,
  errorOccurred: boolean;
}

@Component({
  selector: 'app-receipt-form-dialog',
  templateUrl: './receipt-form-dialog.component.html',
  styleUrls: ['./receipt-form-dialog.component.css']
})
export class ReceiptFormDialogComponent {

  constructor(public dialogRef: MatDialogRef<ReceiptFormDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private router: Router) {

  }

  onBackClick(): void {
    this.dialogRef.close();
    this.router.navigate(["/main-view/main-page"]);
  }
}
