import { Component } from '@angular/core';
import {ReceiptService} from "../../../services/receipt-service";
import {ReceiptModel} from "../../../models/receipt.model";
import {MatDialog} from "@angular/material/dialog";
import {ReceiptItemsDialogComponent} from "./receipt-items-dialog/receipt-items-dialog.component";

@Component({
  selector: 'app-manage-receipts',
  templateUrl: './manage-receipts.component.html',
  styleUrls: ['./manage-receipts.component.css']
})
export class ManageReceiptsComponent {

  possibleYears: number[] = [];

  possibleMonths: MonthItem[] = [];

  receiptService: ReceiptService;

  yearInput: number = 0;

  monthInput: number = 0;

  submitted: boolean = false;

  filteredReceipts: ReceiptModel[] = [];

  constructor(receiptService: ReceiptService, public dialog: MatDialog) {
    this.receiptService = receiptService;
  }

  openDialog(receipt: ReceiptModel): void {
    const dialogRef = this.dialog.open(ReceiptItemsDialogComponent, {
      data: {
        itemNames: receipt.itemNames,
        itemPrices: receipt.itemPrices,
        total: receipt.calculatedTotal,
        date: receipt.receiptDate
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("Dialog closed");
    });
  }

  ngOnInit() {
    this.receiptService.getPossibleYears().subscribe(data => {
      this.possibleYears = data.body;
      if (this.possibleYears.length == 0) {
        this.possibleYears = [2023];
      }
    });

    let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let monthValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    for (let i = 0; i < monthValues.length; i++) {
      let monthItem: MonthItem = {
        name: monthNames[i],
        value: monthValues[i]
      }

      this.possibleMonths.push(monthItem);
    }
  }

  doSearch() {
    this.receiptService.getReceiptsForMonthAndYear(this.yearInput, this.monthInput).subscribe(data => {
      let response = data.body;
      if (response.length == 0) {
        alert("There are no receipts for the given date!");
      } else {
        this.filteredReceipts = data.body;
      }
    });
    this.submitted = true;
  }

  formatDate(receiptDate: string | null) {
    if (receiptDate === null) {
      return receiptDate;
    }

    return receiptDate.replace("T", " ");
  }
}

type MonthItem = {
  name: string,
    value: number
}
