export class ExpenseModel {

  description: string;
  price: number;
  type: string;
  expenseDate: string;

  constructor(description: string, price: number, type: string, expenseDate: string) {
    this.description = description;
    this.price = price;
    this.type = type;
    this.expenseDate = expenseDate;
  }
}
