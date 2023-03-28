import {Component} from '@angular/core';
import {InvoiceService} from "../../../services/invoice-service";
import {InvoiceModel} from "../../../models/invoice.model";

@Component({
  selector: 'app-manage-invoices',
  templateUrl: './manage-invoices.component.html',
  styleUrls: ['./manage-invoices.component.css']
})
export class ManageInvoicesComponent {

  possibleYears: YearItem[] = [];

  possibleMonths: MonthItem[] = [];

  invoiceService: InvoiceService;

  yearInput: number = 0;

  monthInput: number = -1;

  invoicesFound: boolean = false;

  noResults: boolean = false;

  showYearInputError: boolean = false;

  filteredInvoices: InvoiceModel[] = [];

  constructor(invoiceService: InvoiceService) {
    this.invoiceService = invoiceService;
  }

  ngOnInit() {
    this.invoiceService.getPossibleYears().subscribe(data => {
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

  doSearch() {
    if (this.yearInput == 0) {
      this.showYearInputError = true;
      return;
    }

    this.invoiceService.getInvoicesForMonthAndYear(this.yearInput, this.monthInput).subscribe(data => {
      this.showYearInputError = false;

      let response = data.body;
      if (response.length == 0) {
        this.invoicesFound = false;
        this.noResults = true;
      } else {
        this.filteredInvoices = data.body;
        this.noResults = false;
        this.invoicesFound = true;
      }
    });
  }

  formatDate(receiptDate: string | null): string {
    if (receiptDate === null) {
      return "";
    }

    return receiptDate.split("T")[0];
  }

  getPaidDate(date: string): string {
    if (date == null) {
      return "This invoice has not been paid yet!";
    }

    return this.formatDate(date);
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
