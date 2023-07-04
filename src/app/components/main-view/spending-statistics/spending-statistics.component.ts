import {Component} from '@angular/core';
import {PercentageModel} from "../../../models/percentage.model";
import {StatisticsService} from "../../../services/statistics-service";
import {ReceiptService} from "../../../services/receipt-service";
import {FormControl} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {
  SpendingStatisticsErrorDialogComponent
} from "./spending-statistics-error-dialog/spending-statistics-error-dialog.component";
import {
  ApexChart,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexAxisChartSeries,
  ApexXAxis,
  ApexYAxis,
  ApexStroke,
  ApexDataLabels,
  ApexMarkers,
  ApexGrid,
  ApexLegend,
  ApexTitleSubtitle
} from "ng-apexcharts";
import {YearlyStatisticsModel} from "../../../models/yearly-statistics.model";
import {ExpenseService} from "../../../services/expense-service";

export type PieChartOptions = {
  series: ApexNonAxisChartSeries,
  chart: ApexChart,
  responsive: ApexResponsive[],
  labels: any
}

export type LineChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  markers: ApexMarkers;
  colors: string[];
  yaxis: ApexYAxis;
  grid: ApexGrid;
  legend: ApexLegend;
  title: ApexTitleSubtitle;
}

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

  yearlyStatisticsModel: YearlyStatisticsModel = {
    year: 0,
    receipts: [],
    invoices: [],
    expenses: []
  }

  possibleYears: YearItem[] = [];

  possibleMonths: MonthItem[] = [];

  yearInput: number = 0;

  monthInput: number = -1;

  showYearInputError: boolean = false;

  pieChartHeaderText: string = "Breakdown of your all-time expenses";

  pieChartNoData: boolean = false;

  myControl: FormControl;

  public pieChartOptions!: Partial<PieChartOptions> | any;

  public lineChartOptions!: Partial<LineChartOptions> | any;

  isShowLineChart: boolean = false;

  constructor(private statisticsService: StatisticsService, private receiptService: ReceiptService, private expenseService: ExpenseService, private dialog: MatDialog) {
    this.myControl = new FormControl();
    this.myControl.valueChanges.subscribe(value => {
      console.log("Input value changed: ", value);
    });

    this.pieChartOptions = {
      series: [44, 5, 13, 43, 22],

      chart: {
        width: 380,
        type: "pie"
      },

      labels: ["A", "B", "C", "D", "E"],

      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };

    this.lineChartOptions = {
      series: [
        {
          name: "Receipts",
          data: [28, 29, 33, 36, 32, 32, 33]
        },
        {
          name: "Invoices",
          data: [12, 11, 14, 18, 17, 13, 13]
        },
        {
          name: "Expenses",
          data: [12, 11, 14, 40, 17, 13, 13]
        }
      ],

      chart: {
        height: 400,
        type: "line",
        dropShadow: {
          enabled: true,
          color: "#000",
          top: 18,
          left: 7,
          blur: 10,
          opacity: 0.2
        },
        toolbar: {
          show: false
        },
        zoom: {
          enabled: false
        }
      },

      colors: ["#77B6EA", "#545454"],
      dataLabels: {
        enabled: true
      },

      stroke: {
        curve: "smooth"
      },

      title: {
        text: "Breakdown of your expenses for by month",
        align: "center"
      },

      grid: {
        borderColor: "#e7e7e7",
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },

      markers: {
        size: 1
      },

      xaxis: {
        categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        title: {
          text: "Month"
        }
      },

      yaxis: {
        title: {
          text: "Amount"
        }
      },

      legend: {
        position: "top",
        horizontalAlign: "right",
        floating: true,
        offsetY: -25,
        offsetX: -5
      }
    };
  }

  ngOnInit() {
    this.statisticsService.getStatistics(this.yearInput, this.monthInput).subscribe(data => {
      this.percentageModel = data.body;

      this.pieChartOptions.labels = ["Receipts", "Invoices", "Expenses"];
      this.pieChartOptions.series = [
        this.formatToTwoDecimalPoints(this.percentageModel.receipts),
        this.formatToTwoDecimalPoints(this.percentageModel.invoices),
        this.formatToTwoDecimalPoints(this.percentageModel.expenses)
      ];
    });

    this.expenseService.getPossibleYears().subscribe(data => {
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

      if (this.percentageModel.receipts == 0 && this.percentageModel.invoices == 0 && this.percentageModel.expenses == 0) {
        this.pieChartOptions.labels = [];
        this.pieChartOptions.series = [0, 0, 0];
        this.pieChartNoData = true;
        this.openDialog(this.yearInput, this.monthInput);

        return;
      } else {
        this.pieChartNoData = false;
      }

      this.pieChartOptions.labels = ['Receipts', 'Invoices', 'Expenses'];
      this.pieChartOptions.series = [
        this.formatToTwoDecimalPoints(this.percentageModel.receipts),
        this.formatToTwoDecimalPoints(this.percentageModel.invoices),
        this.formatToTwoDecimalPoints(this.percentageModel.expenses)
      ];

      if (this.yearInput <= 0) {
        this.pieChartHeaderText = "Breakdown of your all-time expenses";
      } else {
        if (this.monthInput <= 0) {
          this.pieChartHeaderText = `Breakdown of your expenses for ${this.yearInput}`;
        } else {
          this.pieChartHeaderText = `Breakdown of your expenses for ${this.getMonthNameFromIndex(this.monthInput)} ${this.yearInput}`;
        }
      }
    });
  }

  showLineChart() {
    if (this.yearInput == 0) {
      this.showYearInputError = true;
      return;
    }

    if (this.monthInput > 0 || this.yearInput == -1) {
      this.isShowLineChart = false;
      return;
    }

    this.statisticsService.getYearlyStatisticsByMonth(this.yearInput).subscribe(data => {
      this.showYearInputError = false;
      this.yearlyStatisticsModel = data.body;

      this.lineChartOptions.series = [
        {
          name: "Receipts",
          data: this.yearlyStatisticsModel.receipts
        },
        {
          name: "Invoices",
          data: this.yearlyStatisticsModel.invoices
        },
        {
          name: "Expenses",
          data: this.yearlyStatisticsModel.expenses
        }];

      this.lineChartOptions.title = {
        text: `Breakdown of your expenses for ${this.yearInput} by month`,
        align: "center"
      };

      this.isShowLineChart = true;
      console.log(this.lineChartOptions);
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

  formatToTwoDecimalPoints(num: number): number {
    return +Number(num).toFixed(2);
  }

  showCharts() {
    this.showPieChart();
    this.showLineChart();
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
