import {Component} from '@angular/core';
import {ReceiptService} from "../../../services/receipt-service";
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";
import {ReceiptModel} from "../../../models/receipt.model";

@Component({
  selector: 'app-receipt-form',
  templateUrl: './receipt-form.component.html',
  styleUrls: ['./receipt-form.component.css']
})

export class ReceiptFormComponent {

  inputFields: InputField[];
  itemInputFields: ItemInputField[];

  token!: string | null;

  route: ActivatedRoute;

  router: Router;

  receivedData: any;

  imagePath: string;

  constructor(private receiptService: ReceiptService, route: ActivatedRoute, router: Router, private location: Location) {
    this.receiptService = receiptService;
    this.route = route;
    this.router = router;
    this.imagePath = "";

    let noFields = 10;
    this.inputFields = [];
    this.itemInputFields = [];
    for (let i = 0; i < noFields; i++) {
      let inputField: InputField = {
        name: `name${i}`,
        id: `id${i}`,
        label: `label${i}`,
        value: `value${i}`,
        type: 'text',
        required: true
      };

      this.inputFields.push(inputField);
    }
  }

  onSubmit() {
    let calculatedTotal = this.getValueOfInputFieldWithGivenId("calculated-total");
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
    let receiptDate = this.getValueOfInputFieldWithGivenId("receiptDate");

    let itemNames: Array<string> = [];
    let itemPrices: Array<number> = [];
    for (let i = 0; i < this.itemInputFields.length; i++) {
      let item = this.getValueOfItemInputFieldWithGivenIndex(i);

      itemNames.push(item.name);
      itemPrices.push(item.price);
    }

    let receipt = new ReceiptModel(itemNames, itemPrices,
      actualCalculatedTotal, actualDetectedTotal, retailer, this.imagePath, receiptDate);
    console.log(receipt);
    this.receiptService.addReceipt(receipt).subscribe(data => {
      if (data.status == 201) {
        alert("DA");
      } else {
        alert("NU");
      }
    });
  }

  ngOnInit(): void {
    // @ts-ignore
    this.receivedData = this.location.getState().body;
    console.log(this.receivedData);
    this.imagePath = this.receivedData.imagePath;
    this.populateFields();
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

  addFieldFromButton(event: any): void {
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
      priceRequired: true
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
  }

  addRetailerField(retailerName: string): void {
    let inputField: InputField = {
      name: 'retailer',
      id: 'retailer',
      label: 'Retailer:',
      type: 'text',
      value: retailerName,
      required: false
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
      required: false
    };

    this.inputFields.push(inputField);
  }

  addCalculatedTotalField(calculatedTotal: number): void {
    let inputField: InputField = {
      name: 'calculated-total',
      id: 'calculated-total',
      label: 'Calculated Total:',
      type: 'text',
      value: calculatedTotal.toString(),
      required: false
    };

    this.inputFields.push(inputField);
  }

  addDetectedTotalField(detectedTotal: number): void {
    let inputField: InputField = {
      name: 'detected-total',
      id: 'detected-total',
      label: 'Detected Total:',
      type: 'text',
      value: detectedTotal.toString(),
      required: true
    };

    this.inputFields.push(inputField);
  }

  addItemFields(itemName: string, itemPrice: number, index: number): void {
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
      priceRequired: true
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

        if (this.receivedData.detectedTotal != null) {
          this.addDetectedTotalField(this.receivedData.detectedTotal);
        }

        let itemNames: Array<string> = this.receivedData.itemNames;
        let itemPrices: Array<number> = this.receivedData.itemPrices;

        for (let i = 0; i < itemNames.length; i++) {
          this.addItemFields(itemNames[i], itemPrices[i], i)
        }
  }
}

type InputField = {
  name: string;
  label: string;
  type: string;
  value: string;
  required: boolean;
  id: string;
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
}

type ItemSimple = {
  name: string;
  price: number;
}
