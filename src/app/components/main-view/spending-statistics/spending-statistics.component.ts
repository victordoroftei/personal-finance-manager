import { Component } from '@angular/core';
import {PercentageModel} from "../../../models/percentage.model";
import {StatisticsService} from "../../../services/statistics-service";
import {ReceiptService} from "../../../services/receipt-service";
import {FormControl} from "@angular/forms";
import {ReceiptFormDialogComponent} from "../receipt-form/receipt-form-dialog/receipt-form-dialog.component";
import {MatDialog} from "@angular/material/dialog";
import {
  SpendingStatisticsErrorDialogComponent
} from "./spending-statistics-error-dialog/spending-statistics-error-dialog.component";

@Component({
  selector: 'app-spending-statistics',
  templateUrl: './spending-statistics.component.html',
  styleUrls: ['./spending-statistics.component.css']
})
export class SpendingStatisticsComponent {

  percentageModel: PercentageModel = {
    receipts: 0,
    invoices: 0,
    expenses: 0
  };

  labels: string[] = [];

  pieChartData = [{
    data: [0, 0, 0]
  }];

  possibleYears: YearItem[] = [];

  possibleMonths: MonthItem[] = [];

  yearInput: number = 0;

  monthInput: number = -1;

  showYearInputError: boolean = false;

  pieChartHeaderText: string = "Breakdown of your all-time expenses";

  pieChartNoData: boolean = false;

  myControl: FormControl;

  constructor(private statisticsService: StatisticsService, private receiptService: ReceiptService, private dialog: MatDialog) {
    this.myControl = new FormControl();
    this.myControl.valueChanges.subscribe(value => {
      console.log("Input value changed: ", value);
    });
  }

  ngOnInit() {
    this.statisticsService.getStatistics(this.yearInput, this.monthInput).subscribe(data => {
      this.percentageModel = data.body;

      this.labels = ["Receipts", "Invoices", "Expenses"];
      this.pieChartData = [{
        data: [this.percentageModel.receipts, this.percentageModel.invoices, this.percentageModel.expenses]
      }];
    });

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

      let item: YearItem = {
        displayedValue: "Any Year",
        actualValue: -1
      };
      this.possibleYears.push(item);

      let yearList: number[] = data.body;
      for (let i = 0; i < yearList.length; i++) {
        let item: YearItem = {
          displayedValue: `${yearList[i]}`,
          actualValue: yearList[i]
        };

        this.possibleYears.push(item);
      }
    });

    let monthNames = ["Any Month", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let monthValues = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
    for (let i = 0; i < monthValues.length; i++) {
      let monthItem: MonthItem = {
        name: monthNames[i],
        value: monthValues[i]
      }

      this.possibleMonths.push(monthItem);
    }
  }

  showPieChart() {
    if (this.yearInput == 0) {
      this.showYearInputError = true;
      return;
    }

    this.statisticsService.getStatistics(this.yearInput, this.monthInput).subscribe(data => {
      this.showYearInputError = false;
      this.percentageModel = data.body;

      if (isNaN(this.percentageModel.receipts) && isNaN(this.percentageModel.invoices) && isNaN(this.percentageModel.expenses)) {
        this.pieChartNoData = true;
        this.labels = [];
        this.pieChartData = [{data: [0, 0, 0]}];
        this.openDialog(this.yearInput, this.monthInput);

        return;
      } else {
        this.pieChartNoData = false;
      }

      this.labels = ['Receipts %', 'Invoices %', 'Expenses %'];
      this.pieChartData = [{
        data: [this.percentageModel.receipts, this.percentageModel.invoices, this.percentageModel.expenses]
      }];

      if (this.yearInput <= 0) {
        this.pieChartHeaderText = "Breakdown of your all-time expenses";
      } else {
        if (this.monthInput <= 0) {
          this.pieChartHeaderText = `Breakdown of your expenses for ${this.yearInput}`;
        } else {
          this.pieChartHeaderText = `Breakdown of your expeneses for ${this.getMonthNameFromIndex(this.monthInput)} ${this.yearInput}`;
        }
      }
    });
  }

  getMonthNameFromIndex(monthInput: number): string {
    let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return monthNames[monthInput - 1];
  }

  openDialog(yearInput: number, monthInput: number): void {
    let string = "There is no data";
    if (yearInput <= 0) {
      string += `!`;
    } else {
      if (monthInput <= 0) {
        string += ` for ${this.yearInput}!`;
      } else {
        string += ` for ${this.getMonthNameFromIndex(this.monthInput)} ${this.yearInput}!`;
      }
    }

    const dialogRef = this.dialog.open(SpendingStatisticsErrorDialogComponent, {
      data: {errorMessage: string}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("Dialog closed");
    });
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

