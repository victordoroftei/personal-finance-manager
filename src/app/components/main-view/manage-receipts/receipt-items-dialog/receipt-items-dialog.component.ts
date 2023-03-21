import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";

export interface DialogData {
  itemNames: string[],
  itemPrices: number[],
  total: number,
  date: string
}

@Component({
  selector: 'app-receipt-items-dialog',
  templateUrl: './receipt-items-dialog.component.html',
  styleUrls: ['./receipt-items-dialog.component.css']
})
export class ReceiptItemsDialogComponent {

  itemNames: string[];

  itemPrices: number[];

  total: number;

  date: string;

  items: Item[];

  constructor(public dialogRef: MatDialogRef<ReceiptItemsDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private router: Router) {
    this.dialogRef.updateSize('50%');

    this.itemNames = data.itemNames;
    this.itemPrices = data.itemPrices;
    this.total = data.total;
    this.date = data.date.replace("T", " ");

    this.items = [];
    for (let i = 0; i < this.itemNames.length; i++) {
      let item: Item = {
        name: this.itemNames[i],
        price: this.itemPrices[i]
      };

      this.items.push(item);
    }
  }

  onBackClick(): void {
    this.dialogRef.close();
  }

}

type Item = {
  name: string,
  price: number
}
