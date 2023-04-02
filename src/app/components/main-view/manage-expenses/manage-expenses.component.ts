import { Component } from '@angular/core';
import {StatisticsService} from "../../../services/statistics-service";
import {MatDialog} from "@angular/material/dialog";
import {FormControl} from "@angular/forms";
import {
  ApexAxisChartSeries,
  ApexChart, ApexDataLabels, ApexGrid, ApexLegend, ApexMarkers,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexStroke, ApexTitleSubtitle,
  ApexXAxis, ApexYAxis
} from "ng-apexcharts";
import {ExpensesMonthlyStatisticsModel} from "../../../models/expenses-monthly-statistics.model";
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
  selector: 'app-manage-expenses',
  templateUrl: './manage-expenses.component.html',
  styleUrls: ['./manage-expenses.component.css']
})
export class ManageExpensesComponent {

  public lineChartMonthOptions!: Partial<LineChartOptions> | any;

  public lineChartDayOptions!: Partial<LineChartOptions> | any;

  myControl: FormControl;

  possibleYears: YearItem[] = [];

  possibleMonths: MonthItem[] = [];

  yearInput: number = 0;

  monthInput: number = -1;

  showYearInputError: boolean = false;

  pieChartHeaderText: string = "Breakdown of your all-time expenses";

  pieChartNoData: boolean = false;

  options: OptionItem[] = [];

  isShowLineChartMonth: boolean = false

  isShowLineChartDay: boolean = false;

  isShowNoData: boolean = false;

  showNoDataMessage: string = "";

  constructor(private statisticsService: StatisticsService, private expenseService: ExpenseService, private dialog: MatDialog) {
    this.addOptionItem("RECEIPT", "receipt.png");
    this.addOptionItem("INVOICE", "invoice.png");
    this.addOptionItem("RENT", "rent.png");
    this.addOptionItem("FUEL", "fuel.png");
    this.addOptionItem("TRANSPORT", "transport.png");
    this.addOptionItem("EDUCATION", "education.png");
    this.addOptionItem("CLOTHING", "clothing.png");
    this.addOptionItem("OTHER", "other.png");

    this.myControl = new FormControl();
    this.myControl.valueChanges.subscribe(value => {
      console.log("Input value changed: ", value);
    });

    this.lineChartMonthOptions = {
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

    this.lineChartDayOptions = {
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

  addOptionItem(name: string, icon: string): void {
    let item: OptionItem = {
      name: name,
      icon: icon
    };

    this.options.push(item);
  }

  formatToTwoDecimalPoints(num: number): number {
    return +Number(num).toFixed(2);
  }

  getMonthNameFromIndex(monthInput: number): string {
    let monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    return monthNames[monthInput - 1];
  }

  showLineChart() {
    this.isShowNoData = false;

    if (this.yearInput <= 0) {
      this.showYearInputError = true;
      return;
    }

    this.statisticsService.getExpensesMonthly(this.yearInput, this.monthInput).subscribe(data => {
      this.showYearInputError = false;
      let expensesModel: ExpensesMonthlyStatisticsModel = data.body;

      this.lineChartMonthOptions.series = [
        {
          name: "Receipts",
          data: expensesModel.receipt
        },
        {
          name: "Invoices",
          data: expensesModel.invoice
        },
        {
          name: "Rent",
          data: expensesModel.rent
        },
        {
          name: "Fuel",
          data: expensesModel.fuel
        },
        {
          name: "Food",
          data: expensesModel.food
        },
        {
          name: "Transport",
          data: expensesModel.transport
        },
        {
          name: "Education",
          data: expensesModel.education
        },
        {
          name: "Clothing",
          data: expensesModel.clothing
        },
        {
          name: "Other",
          data: expensesModel.other
        }
        ];

      if (this.monthInput <= 0) {
        this.lineChartMonthOptions.xaxis = {
          categories: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          title: {
            text: "Month"
          }
        };

        this.lineChartMonthOptions.title = {
          text: `Breakdown of your expenses for ${this.yearInput} by month`,
          align: "center"
        };
      } else {
        if (this.checkIfMonthHasNoExpenses(expensesModel)) {
          this.isShowNoData = true;
          this.showNoDataMessage = `There are no expenses for ${this.getMonthNameFromIndex(this.monthInput)} ${this.yearInput}`;
          this.isShowLineChartMonth = false;
          this.isShowLineChartDay = false;
          return;
        }

        this.isShowNoData = false;

        this.lineChartMonthOptions.xaxis = {
          categories: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18",
          "19", "20", "21", "22", "23", "24", "25", "26", "27", "28", "29", "30", "31"],
          title: {
            text: "Day"
          }
        };

        this.lineChartMonthOptions.title = {
          text: `Breakdown of your expenses for ${this.getMonthNameFromIndex(this.monthInput)} ${this.yearInput} by day`,
          align: "center"
        };
      }

      this.isShowLineChartMonth = true;
      console.log(this.lineChartMonthOptions);
      console.log(this.lineChartDayOptions);
    });
  }

  checkIfMonthHasNoExpenses(expensesModel: ExpensesMonthlyStatisticsModel): boolean {
    const receiptSum = expensesModel.receipt.reduce((sum, current) => sum + current, 0);
    const invoiceSum = expensesModel.invoice.reduce((sum, current) => sum + current, 0);
    const rentSum = expensesModel.rent.reduce((sum, current) => sum + current, 0);
    const fuelSum = expensesModel.fuel.reduce((sum, current) => sum + current, 0);
    const foodSum = expensesModel.food.reduce((sum, current) => sum + current, 0);
    const transportSum = expensesModel.transport.reduce((sum, current) => sum + current, 0);
    const educationSum = expensesModel.education.reduce((sum, current) => sum + current, 0);
    const clothingSum = expensesModel.clothing.reduce((sum, current) => sum + current, 0);
    const otherSum = expensesModel.other.reduce((sum, current) => sum + current, 0);

    if (receiptSum == 0 && invoiceSum == 0 && rentSum == 0 && fuelSum == 0 && foodSum == 0 && transportSum == 0
      && educationSum == 0 && clothingSum == 0 && otherSum == 0) {
      return true;
    }

    return false;
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

type OptionItem = {
  name: string,
  icon: string
};
