export class InvoiceModel {

  retailer: string;
  amount: number;
  type: string;
  invoiceDate: string;
  dueDate: string;
  insertedDate: string;
  paidDate: string;
  paid: boolean;


  constructor(retailer: string, amount: number, type: string, invoiceDate: string, dueDate: string, insertedDate: string, paidDate: string, paid: boolean) {
    this.retailer = retailer;
    this.amount = amount;
    this.type = type;
    this.invoiceDate = invoiceDate;
    this.dueDate = dueDate;
    this.insertedDate = insertedDate;
    this.paidDate = paidDate;
    this.paid = paid;
  }
}
