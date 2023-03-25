export class YearlyStatisticsModel {

  year: number;
  receipts: number[];
  invoices: number[];
  expenses: number[];

  constructor(year: number, receipts: number[], invoices: number[], expenses:  number[]) {
    this.year = year;
    this.receipts = receipts;
    this.invoices = invoices;
    this.expenses = expenses;
  }

}
