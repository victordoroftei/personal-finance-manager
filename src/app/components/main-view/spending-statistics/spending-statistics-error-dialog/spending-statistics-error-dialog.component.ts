import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";

export interface DialogData {
  errorMessage: string
}

@Component({
  selector: 'app-spending-statistics-error-dialog',
  templateUrl: './spending-statistics-error-dialog.component.html',
  styleUrls: ['./spending-statistics-error-dialog.component.css']
})
export class SpendingStatisticsErrorDialogComponent {

  constructor(public dialogRef: MatDialogRef<SpendingStatisticsErrorDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private router: Router) {

  }

  onBackClick(): void {
    this.dialogRef.close();
  }
}
