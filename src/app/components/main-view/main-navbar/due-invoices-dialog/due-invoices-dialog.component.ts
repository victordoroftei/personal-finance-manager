import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {InvoiceService} from "../../../../services/invoice-service";
import {InvoiceEntity} from "../../../../models/invoice.entity";

export interface DialogData {
  invoice: InvoiceEntity
}

@Component({
  selector: 'app-due-invoices-dialog',
  templateUrl: './due-invoices-dialog.component.html',
  styleUrls: ['./due-invoices-dialog.component.css']
})
export class DueInvoicesDialogComponent {

  isNothing: boolean = true;

  isSuccess: boolean = false;
  successMessage: string = "";

  isError: boolean = false;
  errorMessage: string = "";

  constructor(public dialogRef: MatDialogRef<DueInvoicesDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private invoiceService: InvoiceService) {

  }

  onYesClick(): void {
    this.invoiceService.payInvoice(this.data.invoice).subscribe(data => {
      this.isNothing = false;
      this.isSuccess = true;
      this.successMessage = "The invoice has been paid!";
    }, error => {
      this.isNothing = false;
      this.isError = true;
      this.errorMessage = "An unexpected error occurred!";
    });
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  onNoClick(): void {
    this.dialogRef.close();
    window.location.reload();
  }
}
