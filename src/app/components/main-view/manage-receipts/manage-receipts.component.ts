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

  possibleYears: YearItem[] = [];

  possibleMonths: MonthItem[] = [];

  receiptService: ReceiptService;

  yearInput: number = 0;

  monthInput: number = 0;

  receiptsFound: boolean = false;

  noResults: boolean = false;

  showYearInputError: boolean = false;

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
      if (data.body.length == 0) {
        let item: YearItem = {
          displayedValue: '2023',
          actualValue: 2023
        };

        this.possibleYears = [item];
        return;
      }

      //this.possibleYears = data.body;
      let yearList: number[] = data.body;
      for (let i = 0; i < yearList.length; i++) {
        let item: YearItem = {
          displayedValue: `${yearList[i]}`,
          actualValue: yearList[i]
        };

        this.possibleYears.push(item);
      }

      let item: YearItem = {
        displayedValue: "Any Year",
        actualValue: -1
      };
      this.possibleYears.push(item);
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
    if (this.yearInput == 0) {
      this.showYearInputError = true;
      return;
    }

    this.receiptService.getReceiptsForMonthAndYear(this.yearInput, this.monthInput).subscribe(data => {
      this.showYearInputError = false;

      let response = data.body;
      if (response.length == 0) {
        this.receiptsFound = false;
        this.noResults = true;
      } else {
        this.filteredReceipts = data.body;
        this.noResults = false;
        this.receiptsFound = true;
      }
    });
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

type YearItem = {
  displayedValue: string,
  actualValue: number
}
