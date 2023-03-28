import { Component } from '@angular/core';
import {InvoiceModel} from "../../../models/invoice.model";
import {InvoiceService} from "../../../services/invoice-service";
import {MatDialog} from "@angular/material/dialog";
import {AddInvoiceDialogComponent} from "./add-invoice-dialog/add-invoice-dialog.component";

@Component({
  selector: 'app-add-invoice',
  templateUrl: './add-invoice.component.html',
  styleUrls: ['./add-invoice.component.css']
})
export class AddInvoiceComponent {
  isPaymentDateInputDisabled: boolean = true;

  options: string[] = ["ELECTRICITY", "GAS", "TELECOMMUNICATIONS", "OTHER"];

  todayDate: Date = new Date();

  isInvoiceDateError: boolean = false;

  isPaymentDateError: boolean = false;

  isDueDateError: boolean = false;

  isRetailerError: boolean = false;

  isTypeError: boolean = false;

  isAmountError: boolean = false;

  dueDateModel: string = "";

  invoiceDateModel: string = "";

  paymentDateModel: string = "";

  retailerModel: string = "";

  typeModel: string = "";

  amountModel: number = 0;

  constructor(private invoiceService: InvoiceService, private dialog: MatDialog) {

  }

  setDisabled(checked: boolean) {
    this.isPaymentDateInputDisabled = !checked;
  }

  test() {
    console.log(this.dueDateModel);
    console.log(this.paymentDateModel);
    console.log(this.invoiceDateModel);
    let dueDate = new Date(this.dueDateModel);
    console.log(this.parseDate(dueDate.getFullYear(), dueDate.getMonth() + 1, dueDate.getDate()));
  }

  parseDate(year: number, month: number, day: number) {
    if (month <= 9) {
      if (day <= 9) {
        return `${year}-0${month}-0${day}T00:00:00`;
      }
      return `${year}-0${month}-${day}T00:00:00`;
    }
    return `${year}-${month}-${day}T00:00:00`;
  }

  addInvoice() {
    if (!this.validateRetailer()) {
      this.isRetailerError = true;
      // @ts-ignore
      document.getElementById("retailerError").innerText = "A retailer name must be provided!";
    } else {
      this.isRetailerError = false;
      // @ts-ignore
      document.getElementById("retailerError").innerHTML = "&nbsp;";
    }

    if (!this.validateType()) {
      this.isTypeError = true;
      // @ts-ignore
      document.getElementById("typeError").innerText = "A type must be selected!";
    } else {
      this.isTypeError = false;
      // @ts-ignore
      document.getElementById("typeError").innerHTML = "&nbsp;";
    }

    if (!this.validateAmount()) {
      this.isAmountError = true;
      // @ts-ignore
      document.getElementById("amountError").innerText = "A valid amount must be selected!";
    } else {
      this.isAmountError = false;
      // @ts-ignore
      document.getElementById("amountError").innerHTML = "&nbsp;";
    }

    let invoiceDate: Date = new Date(this.invoiceDateModel);

    if (this.dueDateModel == null || this.dueDateModel == "" || invoiceDate.getFullYear() <= 1970 || invoiceDate.getFullYear() > 2024) {
      this.isInvoiceDateError = true;
      // @ts-ignore
      document.getElementById("invoiceDateError").innerText = "A valid invoice issue date must be selected!";
    } else {
      this.isInvoiceDateError = false;
      // @ts-ignore
      document.getElementById("invoiceDateError").innerHTML = "&nbsp;";
    }

    let invoiceDateString: string = this.parseDate(invoiceDate.getFullYear(), invoiceDate.getMonth() + 1, invoiceDate.getDate());

    let dueDate: Date = new Date(this.dueDateModel);
    if (this.dueDateModel == null || this.dueDateModel == "" || dueDate.getFullYear() <= 1970 || dueDate.getFullYear() > 2024) {
      this.isDueDateError = true;
      // @ts-ignore
      document.getElementById("dueDateError").innerText = "A valid due date must be selected!";
    } else {
      this.isDueDateError = false;
      // @ts-ignore
      document.getElementById("dueDateError").innerHTML = "&nbsp;";
    }

    let dueDateString: string = this.parseDate(dueDate.getFullYear(), dueDate.getMonth() + 1, dueDate.getDate());

    let paymentDate: Date = new Date(this.paymentDateModel);
    console.log(this.paymentDateModel);
    if (paymentDate.getFullYear() <= 1970 || paymentDate.getFullYear() > 2024) {
      this.isPaymentDateError = true;
      // @ts-ignore
      document.getElementById("paymentDateError").innerText = "A valid payment date must be selected!";
    } else {
      this.isPaymentDateError = false;
      // @ts-ignore
      document.getElementById("paymentDateError").innerHTML = "&nbsp;";
    }

    if (this.isRetailerError || this.isInvoiceDateError || this.isAmountError || this.isInvoiceDateError || this.isDueDateError || this.isPaymentDateError) {
      return;
    }

    let paymentDateString: string = "";
    let paid: boolean = false;
    if (this.paymentDateModel) {
      let paymentDate: Date = new Date(this.paymentDateModel);

      paymentDateString = this.parseDate(paymentDate.getFullYear(), paymentDate.getMonth() + 1, paymentDate.getDate());
      paid = true;
    }

    if (paymentDate < invoiceDate) {
      this.openDialog("The payment date cannot be earlier than the invoice issue date!", true);
      return;
    }

    let invoiceModel: InvoiceModel = {
      retailer: this.retailerModel,
      amount: this.amountModel,
      type: this.typeModel,
      invoiceDate: invoiceDateString,
      dueDate: dueDateString,
      insertedDate: "",
      paid: paid,
      paidDate: paymentDateString
    };

    this.invoiceService.addInvoice(invoiceModel).subscribe(data => {
      if (data.status == 201) {
        this.openDialog("Invoice successfully added!", false);
      }
    }, error => {
      if (error.status < 500) {
        console.log(error);
        this.openDialog("Invoice could not be added!", true);
      } else {
        console.log(error);
        this.openDialog("An unexpected error occurred!", true);
      }
    });
  }

  openDialog(message: string, errorOccurred: boolean): void {
    const dialogRef = this.dialog.open(AddInvoiceDialogComponent, {
      data: {message: message, errorOccurred: errorOccurred}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("Dialog closed");

      if (!errorOccurred) {
        window.location.reload();
      }
    });
  }

  validateRetailer(): boolean {
    return !(this.retailerModel.length < 1 || this.retailerModel === " " || this.retailerModel === "");
  }

  validateType(): boolean {
    return this.options.indexOf(this.typeModel) > -1;
  }

  validateAmount(): boolean {
    if (isNaN(+this.amountModel)) {
      return false;
    }

    if (this.amountModel <= 0) {
      return false;
    }

    return true;
  }
}
