import {Component, ViewChild} from '@angular/core';
import {StatisticsService} from "../../../services/statistics-service";
import {MatDialog} from "@angular/material/dialog";
import {FormControl} from "@angular/forms";
import {
  ApexAxisChartSeries,
  ApexChart, ApexDataLabels, ApexGrid, ApexLegend, ApexMarkers,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexStroke, ApexTitleSubtitle,
  ApexXAxis, ApexYAxis, ChartComponent
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

  isReceiptChecked: boolean = true;

  isInvoiceChecked: boolean = true;

  isRentChecked: boolean = true;

  isFuelChecked: boolean = true;

  isFoodChecked: boolean = true;

  isTransportChecked: boolean = true;

  isEducationChecked: boolean = true;

  isClothingChecked: boolean = true;

  isOtherChecked: boolean = true;

  @ViewChild("monthChart") monthChart: ChartComponent | undefined;

  expensesModel: ExpensesMonthlyStatisticsModel;

  constructor(private statisticsService: StatisticsService, private expenseService: ExpenseService, private dialog: MatDialog) {
    this.addOptionItem("RECEIPT", "receipt.png");
    this.addOptionItem("INVOICE", "invoice.png");
    this.addOptionItem("RENT", "rent.png");
    this.addOptionItem("FUEL", "fuel.png");
    this.addOptionItem("FOOD", "food.png");
    this.addOptionItem("TRANSPORT", "transport.png");
    this.addOptionItem("EDUCATION", "education.png");
    this.addOptionItem("CLOTHING", "clothing.png");
    this.addOptionItem("OTHER", "other.png");

    this.expensesModel =
      new ExpensesMonthlyStatisticsModel(0, 0, [], [], [], [], [], [], [], [], []);

    this.myControl = new FormControl();
    this.myControl.valueChanges.subscribe(value => {
      console.log("Input value changed: ", value);
    });

    this.lineChartMonthOptions = {
      series: [
        {
          name: "RECEIPTS",
          data: [28, 29, 33, 36, 32, 32, 33]
        },
        {
          name: "INVOICES",
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

      colors: ["#FF0000", "#0000FF", "#008000", "#ADD8E6", "#800080", "#FFA500", "#FFC0CB", "#000080", "#A52A2A"],
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
      icon: icon,
      isChecked: true
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
      this.expensesModel = expensesModel;

      this.lineChartMonthOptions.series = [
        {
          name: "RECEIPTS",
          data: expensesModel.receipt,
          color: "#FF0000"
        },
        {
          name: "INVOICES",
          data: expensesModel.invoice,
          color: "#0000FF"
        },
        {
          name: "RENT",
          data: expensesModel.rent,
          color: "#008000"
        },
        {
          name: "FUEL",
          data: expensesModel.fuel,
          color: "#ADD8E6"
        },
        {
          name: "FOOD",
          data: expensesModel.food,
          color: "#800080"
        },
        {
          name: "TRANSPORT",
          data: expensesModel.transport,
          color: "#FFA500"
        },
        {
          name: "EDUCATION",
          data: expensesModel.education,
          color: "#FFC0CB"
        },
        {
          name: "CLOTHING",
          data: expensesModel.clothing,
          color: "#000080"
        },
        {
          name: "OTHER",
          data: expensesModel.other,
          color: "#A52A2A"
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

  checkboxValueChanged(checked: boolean, option: OptionItem) {
    console.log("Changed");
    console.log(option);
    option.isChecked = checked;

    let newSeries: ApexAxisChartSeries = [];
    if (this.options[0].isChecked) {
      newSeries.push({
        name: this.options[0].name,
        data: this.expensesModel.receipt,
        color: "#FF0000"
      });
    }

    if (this.options[1].isChecked) {
      newSeries.push({
        name: this.options[1].name,
        data: this.expensesModel.invoice,
        color: "#0000FF"
      });
    }

    if (this.options[2].isChecked) {
      newSeries.push({
        name: this.options[2].name,
        data: this.expensesModel.rent,
        color: "#008000"
      });
    }

    if (this.options[3].isChecked) {
      newSeries.push({
        name: this.options[3].name,
        data: this.expensesModel.fuel,
        color: "#ADD8E6"
      });
    }

    if (this.options[4].isChecked) {
      newSeries.push({
        name: this.options[4].name,
        data: this.expensesModel.food,
        color: "#800080"
      });
    }

    if (this.options[5].isChecked) {
      newSeries.push({
        name: this.options[5].name,
        data: this.expensesModel.transport,
        color: "#FFA500"
      });
    }

    if (this.options[6].isChecked) {
      newSeries.push({
        name: this.options[6].name,
        data: this.expensesModel.education,
        color: "#FFC0CB"
      });
    }

    if (this.options[7].isChecked) {
      newSeries.push({
        name: this.options[7].name,
        data: this.expensesModel.clothing,
        color: "#000080"
      });
    }

    if (this.options[8].isChecked) {
      newSeries.push({
        name: this.options[8].name,
        data: this.expensesModel.other,
        color: "#A52A2A"
      });
    }

    console.log(newSeries);
    this.lineChartMonthOptions.series = newSeries;
    this.monthChart?.updateSeries(this.lineChartMonthOptions.series);
  }

  findIndexInList(name: string): number {
    for (let i = 0; i < this.lineChartMonthOptions.series.length; i++) {
      if (this.lineChartMonthOptions.series[i].name.toLowerCase() == name.toLowerCase()) {
        return i;
      }
    }

    return -1;
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
  isChecked: boolean
};
