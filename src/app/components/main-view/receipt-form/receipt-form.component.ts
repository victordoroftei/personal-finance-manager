import {Component} from '@angular/core';
import {ReceiptService} from "../../../services/receipt-service";
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {ReceiptModel} from "../../../models/receipt.model";
import {FormControl} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {ReceiptFormDialogComponent} from "./receipt-form-dialog/receipt-form-dialog.component";

@Component({
  selector: 'app-receipt-form',
  templateUrl: './receipt-form.component.html',
  styleUrls: ['./receipt-form.component.css']
})

export class ReceiptFormComponent {

  inputFields: InputField[];
  itemInputFields: ItemInputField[];
  calculatedTotalField: InputField;

  token!: string | null;

  route: ActivatedRoute;

  router: Router;

  receivedData: any;

  imagePath: string;

  myControl: FormControl;

  fullImagePath: string;

  mySrc: any;

  constructor(private receiptService: ReceiptService, route: ActivatedRoute, router: Router, private location: Location, private dialog: MatDialog) {
    this.receiptService = receiptService;
    this.route = route;
    this.router = router;
    this.imagePath = "";
    this.fullImagePath = "";
    this.mySrc = null;

    this.inputFields = [];
    this.itemInputFields = [];

    this.calculatedTotalField = {
      name: 'calculated-total',
      id: 'calculated-total',
      label: 'Calculated Total:',
      type: 'text',
      value: '0.0',
      required: false,
      disabled: true
    };

    this.myControl = new FormControl();
    this.myControl.valueChanges.subscribe(value => {
      console.log("Input value changed: ", value);
    });
  }

  onSubmit() {
    let calculatedTotal = this.calculatedTotalField.value;
    let actualCalculatedTotal = null;
    if (calculatedTotal !== null) {
      actualCalculatedTotal = +calculatedTotal;
    }

    let detectedTotal = this.getValueOfInputFieldWithGivenId("detected-total");
    let actualDetectedTotal = null;
    if (detectedTotal !== null) {
      actualDetectedTotal = +detectedTotal;
    }

    let retailer = this.getValueOfInputFieldWithGivenId("retailer");
    let receiptDate = this.getValueOfInputFieldWithGivenId("receipt-date");
    console.log(receiptDate);
    // @ts-ignore
    receiptDate = receiptDate?.replace(" ", "T");
    console.log(receiptDate);

    let itemNames: Array<string> = [];
    let itemPrices: Array<number> = [];
    for (let i = 0; i < this.itemInputFields.length; i++) {
      let item = this.getValueOfItemInputFieldWithGivenIndex(i);

      itemNames.push(item.name);
      itemPrices.push(item.price);
    }

    if (`${receiptDate}`.split(":").length - 1 == 1) {
      receiptDate = receiptDate + ":00";
    }

    let receipt = new ReceiptModel(itemNames, itemPrices,
      actualCalculatedTotal, actualDetectedTotal, retailer, this.imagePath, receiptDate);
    console.log(receipt);
    this.receiptService.addReceipt(receipt).subscribe(data => {
      if (data.status == 201) {
        this.openDialog(false);
      } else {
        this.openDialog(true);
      }
    });
  }

  openDialog(errorOccurred: boolean): void {
    let string;

    if (errorOccurred) {
      string = "An unexpected error has occurred while trying to save your receipt!";
    } else {
      string = "Your receipt has been successfully added!";
    }

    const dialogRef = this.dialog.open(ReceiptFormDialogComponent, {
      data: {message: string, errorOccurred: errorOccurred}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log("Dialog closed");
    });
  }

  ngOnInit(): void {
    // @ts-ignore
    this.receivedData = this.location.getState().body;
    console.log(this.receivedData);

    if (this.receivedData) {
      this.imagePath = this.receivedData.imagePath;
      this.populateFields();
    } else {
      this.addFieldsWithoutFileUploaded();
    }
  }

  addFieldsWithoutFileUploaded(): void {
    this.addRetailerField("");
    this.addReceiptDateField("");
    this.addItemField("", 0, 0);
  }

  getValueOfInputFieldWithGivenId(id: string) {
    for (let i = 0; i < this.inputFields.length; i++) {
      if (this.inputFields[i].id === id) {
        return this.inputFields[i].value;
      }
    }

    return null;
  }

  getValueOfItemInputFieldWithGivenIndex(index: number) {
    let name: string = this.itemInputFields[index].nameValue;
    let price: number = +this.itemInputFields[index].priceValue;  // +string converts the string to a number
    let item: ItemSimple = {
      name: name,
      price: price
    };

    return item;
  }

  addItemFieldFromButton(event: any): void {
    event.preventDefault();

    let newItemInputField: ItemInputField = {
        label: `Item ${this.itemInputFields.length + 1}:`,
        nameName: `name-item${this.itemInputFields.length + 1}`,
        nameType: 'text',
        nameId: `name-item${this.itemInputFields.length + 1}`,
        nameValue: '',
        nameRequired: true,
        priceName: `price-item${this.itemInputFields.length + 1}`,
        priceType: 'text',
        priceId: `price-item${this.itemInputFields.length + 1}`,
        priceValue: 0,
        priceRequired: true,
        index: this.itemInputFields.length + 1
    };

    this.itemInputFields.push(newItemInputField);
  }

  removeFieldFromInputFields(inputField: InputField): void {
    // We will remove the field with the name equal to the name of the input field that needs to be removed.

    let inputFieldIndex = 0;

    for (let i = 0; i < this.inputFields.length; i++) {
      if (this.inputFields[i].name === inputField.name) {
        inputFieldIndex = i;
        break;
      }
    }

    this.inputFields.splice(inputFieldIndex, 1);  // Removes the element of the array with the given index
  }

  removeItemFieldFromInputFields(itemInputField: ItemInputField): void {
    let inputFieldIndex = 0;

    for (let i = 0; i < this.itemInputFields.length; i++) {
      if (this.itemInputFields[i].nameName === itemInputField.nameName) {
        inputFieldIndex = i;
        break;
      }
    }

    this.itemInputFields.splice(inputFieldIndex, 1);

    for (let i = 0; i < this.itemInputFields.length; i++) {
      let itemInputField: ItemInputField = {
        label: `Item ${i + 1}:`,
        nameName: `name-item${i + 1}`,
        nameId: `name-item${i + 1}`,
        nameType: 'text',
        nameValue: this.itemInputFields[i].nameValue,
        nameRequired: true,
        priceName: `price-item${i + 1}`,
        priceId: `price-item${i + 1}`,
        priceType: 'text',
        priceValue: this.itemInputFields[i].priceValue,
        priceRequired: true,
        index: i
      };

      this.itemInputFields[i] = itemInputField;
    }

    this.recalculateTotal();
  }

  addRetailerField(retailerName: string): void {
    let inputField: InputField = {
      name: 'retailer',
      id: 'retailer',
      label: 'Retailer:',
      type: 'text',
      value: retailerName,
      required: false,
      disabled: false
    };

    this.inputFields.push(inputField);
  }

  addReceiptDateField(receiptDate: string): void {
    let inputField: InputField = {
      name: 'receipt-date',
      id: 'receipt-date',
      label: 'Receipt Date:',
      type: 'datetime-local',
      value: receiptDate.replace('T', ' '),
      required: true,
      disabled: false
    };

    this.inputFields.push(inputField);
  }

  addCalculatedTotalField(calculatedTotal: number): void {
    this.calculatedTotalField = {
      name: 'calculated-total',
      id: 'calculated-total',
      label: 'Calculated Total:',
      type: 'text',
      value: calculatedTotal.toString(),
      required: false,
      disabled: true
    };
  }

  addDetectedTotalField(detectedTotal: number): void {
    let inputField: InputField = {
      name: 'detected-total',
      id: 'detected-total',
      label: 'Detected Total:',
      type: 'text',
      value: detectedTotal.toString(),
      required: true,
      disabled: false
    };

    this.inputFields.push(inputField);
  }

  addItemField(itemName: string, itemPrice: number, index: number): void {
    let itemInputField: ItemInputField = {
      label: `Item ${index + 1}:`,
      nameName: `name-item${index + 1}`,
      nameId: `name-item${index + 1}`,
      nameType: 'text',
      nameValue: itemName,
      nameRequired: true,
      priceName: `price-item${index + 1}`,
      priceId: `price-item${index + 1}`,
      priceType: 'text',
      priceValue: itemPrice,
      priceRequired: true,
      index: index
    };

    this.itemInputFields.push(itemInputField);
  }

  populateFields(): void {
        this.inputFields = [];

        if (this.receivedData.retailer != null) {
          this.addRetailerField(this.receivedData.retailer);
        }

        if (this.receivedData.receiptDate != null) {
          this.addReceiptDateField(this.receivedData.receiptDate);
        }

        if (this.receivedData.calculatedTotal != null) {
          this.addCalculatedTotalField(this.receivedData.calculatedTotal);
        }

        let itemNames: Array<string> = this.receivedData.itemNames;
        let itemPrices: Array<number> = this.receivedData.itemPrices;

        for (let i = 0; i < itemNames.length; i++) {
          this.addItemField(itemNames[i], itemPrices[i], i)
        }
  }

  recalculateTotal() {
    let sum = Number();
    for (let i = 0; i < this.itemInputFields.length; i++) {
      sum = sum + Number(this.itemInputFields[i].priceValue);
      sum = Number((Math.round(sum * 100) / 100).toFixed(2));
    }

    this.calculatedTotalField.value = sum.toString();
  }

  onBackButtonClick() {
    this.router.navigate(["/main-view/main-page"]);
  }
}

type InputField = {
  name: string;
  label: string;
  type: string;
  value: string;
  required: boolean;
  id: string;
  disabled: boolean;
}

type ItemInputField = {
  nameName: string;
  priceName: string;
  label: string;
  nameType: string;
  priceType: string;
  nameValue: string;
  priceValue: number;
  nameRequired: boolean;
  priceRequired: boolean;
  nameId: string;
  priceId: string;
  index: number;
}

type ItemSimple = {
  name: string;
  price: number;
}
