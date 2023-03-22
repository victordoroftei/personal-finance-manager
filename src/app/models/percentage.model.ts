export class PercentageModel {

  receipts: number;
  invoices: number;
  expenses: number;

  constructor(receipts: number, invoices: number, expenses:  number) {
    this.receipts = receipts;
    this.invoices = invoices;
    this.expenses = expenses;
  }

}
