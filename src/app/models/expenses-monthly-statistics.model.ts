export class ExpensesMonthlyStatisticsModel {

  year: number;
  month: number;
  receipt: number[];
  invoice: number[];
  rent: number[];
  fuel: number[];
  food: number[];
  transport: number[];
  education: number[];
  clothing: number[];
  other: number[];


  constructor(year: number, month: number, receipt: number[], invoice: number[], rent: number[], fuel: number[],
              food: number[], transport: number[], education: number[], clothing: number[], other: number[]) {
    this.year = year;
    this.month = month;
    this.receipt = receipt;
    this.invoice = invoice;
    this.rent = rent;
    this.fuel = fuel;
    this.food = food;
    this.transport = transport;
    this.education = education;
    this.clothing = clothing;
    this.other = other;
  }
}
