import { Component } from '@angular/core';
import {ExpenseModel} from "../../../models/expense.model";
import {ExpenseService} from "../../../services/expense-service";
import {AddInvoiceDialogComponent} from "../add-invoice/add-invoice-dialog/add-invoice-dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-add-expense',
  templateUrl: './add-expense.component.html',
  styleUrls: ['./add-expense.component.css']
})
export class AddExpenseComponent {

  options: OptionItem[] = [];

  descriptionModel: string = "";

  typeModel: string = "";

  priceModel: number = 0;

  expenseDateModel: string = "";

  todayDate: Date = new Date();

  isDescriptionError: boolean = false;

  isTypeError: boolean = false;

  isPriceError: boolean = false;

  isExpenseDateError: boolean = false;

  constructor(private expenseService: ExpenseService, private dialog: MatDialog) {
    this.addOptionItem("RECEIPT", "receipt.png");
    this.addOptionItem("INVOICE", "invoice.png");
    this.addOptionItem("RENT", "rent.png");
    this.addOptionItem("FUEL", "fuel.png");
    this.addOptionItem("FOOD", "food.png");
    this.addOptionItem("TRANSPORT", "transport.png");
    this.addOptionItem("EDUCATION", "education.png");
    this.addOptionItem("CLOTHING", "clothing.png");
    this.addOptionItem("OTHER", "other.png");
  }

  addOptionItem(name: string, icon: string): void {
    let item: OptionItem = {
      name: name,
      icon: icon
    };

    this.options.push(item);
  }

  parseDate(year: number, month: number, day: number) {
    if (month <= 9) {
      if (day <= 9) {
        return `${year}-0${month}-0${day}T00:00:00`;
      }
      return `${year}-0${month}-${day}T00:00:00`;
    }
    return `${year}-${month}-${day}T00:00:00`;
  }

  addExpense(): void {
    if (!this.validateDescription()) {
      this.isDescriptionError = true;
      // @ts-ignore
      document.getElementById("descriptionError").innerText = "A description must be provided!";
    } else {
      this.isDescriptionError = false;
      // @ts-ignore
      document.getElementById("descriptionError").innerHTML = "&nbsp;";
    }

    if (!this.validateType()) {
      this.isTypeError = true;
      // @ts-ignore
      document.getElementById("typeError").innerText = "An expense type must be selected!";
    } else {
      this.isTypeError = false;
      // @ts-ignore
      document.getElementById("typeError").innerHTML = "&nbsp;";
    }

    if (!this.validatePrice()) {
      this.isPriceError = true;
      // @ts-ignore
      document.getElementById("priceError").innerText = "A valid price must be provided!";
    } else {
      this.isPriceError = false;
      // @ts-ignore
      document.getElementById("priceError").innerHTML = "&nbsp;";
    }

    let expenseDate: Date = new Date(this.expenseDateModel);

    if (this.expenseDateModel == null || this.expenseDateModel == "" || expenseDate.getFullYear() <= 1970 || expenseDate.getFullYear() > 2024) {
      this.isExpenseDateError = true;
      // @ts-ignore
      document.getElementById("expenseDateError").innerText = "A valid expense date must be selected!";
    } else {
      this.isExpenseDateError = false;
      // @ts-ignore
      document.getElementById("expenseDateError").innerHTML = "&nbsp;";
    }

    let expenseDateString: string = this.parseDate(expenseDate.getFullYear(), expenseDate.getMonth() + 1, expenseDate.getDate());

    if (this.isDescriptionError || this.isExpenseDateError || this.isPriceError || this.isTypeError) {
      return;
    }

    let expenseModel: ExpenseModel = {
      description: this.descriptionModel,
      price: this.priceModel,
      type: this.typeModel,
      expenseDate: expenseDateString
    };

    this.expenseService.addExpense(expenseModel).subscribe(data => {
      if (data.status == 201) {
        this.openDialog("Expense successfully added!", false);
      }
    }, error => {
      if (error.status < 500) {
        console.log(error);
        this.openDialog("Expense could not be added!", true);
      } else {
        console.log(error);
        this.openDialog("An unexpected error occurred!", true);
      }
    });
  }

  openDialog(message: string, errorOccurred: boolean): void {
    const dialogRef = this.dialog.open(AddInvoiceDialogComponent, {
      data: {message: message, errorOccurred: errorOccurred}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("Dialog closed");

      if (!errorOccurred) {
        window.location.reload();
      }
    });
  }

  validateDescription(): boolean {
    return !(this.descriptionModel.length < 1 || this.descriptionModel === " " || this.descriptionModel === "");
  }

  validateType(): boolean {
    for (let i = 0; i < this.options.length; i++) {
      if (this.options[i].name === this.typeModel) {
        return true;
      }
    }
    return false;
  }

  validatePrice(): boolean {
    if (isNaN(+this.priceModel)) {
      return false;
    }

    if (this.priceModel <= 0) {
      return false;
    }

    return true;
  }
}

type OptionItem = {
  name: string,
  icon: string
};
