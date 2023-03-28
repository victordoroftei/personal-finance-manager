import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";

export interface DialogData {
  message: string,
  errorOccurred: boolean
}

@Component({
  selector: 'app-add-invoice-dialog',
  templateUrl: './add-invoice-dialog.component.html',
  styleUrls: ['./add-invoice-dialog.component.css']
})
export class AddInvoiceDialogComponent {

  message: string = "";

  errorOccurred: boolean = false;

  buttonText: string = "Back";

  constructor(public dialogRef: MatDialogRef<AddInvoiceDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private router: Router) {
    this.message = data.message;
    this.errorOccurred = data.errorOccurred;

    if (this.errorOccurred) {
      this.buttonText = "Back";
    }
  }

  onBackClick(): void {
    if (this.errorOccurred) {
      this.dialogRef.close();
    } else {
      this.dialogRef.close();
      //this.router.navigate(["main-view/main-page"]);
    }
  }

}
