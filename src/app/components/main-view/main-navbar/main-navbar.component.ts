import { Component, OnInit } from '@angular/core';
import {UserService} from "../../../services/user-service";
import {InvoiceService} from "../../../services/invoice-service";
import {MatDialog} from "@angular/material/dialog";
import {DueInvoicesDialogComponent} from "./due-invoices-dialog/due-invoices-dialog.component";
import {InvoiceEntity} from "../../../models/invoice.entity";
import {
  NotificationSettingsDialogComponent
} from "./notification-settings-dialog/notification-settings-dialog.component";

export interface DialogData {
  invoice: InvoiceEntity;
}

@Component({
  selector: 'app-main-navbar',
  templateUrl: './main-navbar.component.html',
  styleUrls: ['./main-navbar.component.css']
})
export class MainNavbarComponent implements OnInit {

  dueInvoicesArray: InvoiceEntity[] = [];

  constructor(private userService: UserService, private invoiceService: InvoiceService, public dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.invoiceService.getDueInvoices().subscribe(data => {
      this.dueInvoicesArray = data.body;

      for (let i = 0; i < this.dueInvoicesArray.length; i++) {
        this.dueInvoicesArray[i].dueDate = this.formatDate(this.dueInvoicesArray[i].dueDate);
      }

      console.log(this.dueInvoicesArray);
    });
  }

  formatDate(date: string): string {
    let splitArr: string[] = date.split("T");
    return splitArr[0];
  }

  logout() {
    this.userService.logout();
  }

  onPayClick(invoice: InvoiceEntity): void {
    const dialogRef = this.dialog.open(DueInvoicesDialogComponent, {
      data: {invoice: invoice}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("Payment confirmation dialog closed");
    });
  }

  openNotificationSettingsDialog(): void {
    const dialogRef = this.dialog.open(NotificationSettingsDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log("Notification settings dialog closed");
    });
  }
}
