import {Component} from '@angular/core';
import {ReceiptService} from "../../../services/receipt-service";
import {ActivatedRoute, Router} from "@angular/router";
import {Location} from "@angular/common";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})

export class MainPageComponent {

  inputFields: InputField[];
  itemInputFields: ItemInputField[];

  token!: string | null;

  route: ActivatedRoute;

  router: Router;

  receivedData: any;

  constructor(private receiptService: ReceiptService, route: ActivatedRoute, router: Router, private location: Location) {
    this.receiptService = receiptService;
    this.route = route;
    this.router = router;

    let noFields = 10;
    this.inputFields = [];
    this.itemInputFields = [];
    for (let i = 0; i < noFields; i++) {
      let inputField: InputField = {
        name: `name${i}`,
        label: `label${i}`,
        value: `value${i}`,
        type: 'text',
        required: true
      };

      this.inputFields.push(inputField);
    }
  }

  onSubmit() {
    console.log(this.inputFields);
  }

  ngOnInit(): void {
    // @ts-ignore
    this.receivedData = this.location.getState().body;
    console.log(this.receivedData);
    this.populateFields();
  }

  addFieldFromButton() {
    let newInputField: InputField = {
      name: `newName`,
      label: `newLabel`,
      value: `newValue`,
      type: `text`,
      required: true
    };

    this.inputFields.push(newInputField);
  }

  removeFieldFromInputFields(inputField: InputField) {
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

  removeItemFieldFromInputFields(itemInputField: ItemInputField) {
    let inputFieldIndex = 0;

    for (let i = 0; i < this.itemInputFields.length; i++) {
      if (this.itemInputFields[i].nameName === itemInputField.nameName) {
        inputFieldIndex = i;
        break;
      }
    }

    this.itemInputFields.splice(inputFieldIndex, 1);
  }

  addRetailerField(retailerName: string) {
    let inputField: InputField = {
      name: 'retailer',
      label: 'Retailer:',
      type: 'text',
      value: retailerName,
      required: false
    };

    this.inputFields.push(inputField);
  }

  addReceiptDateField(receiptDate: string) {
    let inputField: InputField = {
      name: 'receipt-date',
      label: 'Receipt Date:',
      type: 'datetime-local',
      value: receiptDate.replace('T', ' '),
      required: false
    };

    this.inputFields.push(inputField);
  }

  addCalculatedTotalField(calculatedTotal: number) {
    let inputField: InputField = {
      name: 'calculated-total',
      label: 'Calculated Total:',
      type: 'text',
      value: calculatedTotal.toString(),
      required: false
    };

    this.inputFields.push(inputField);
  }

  addDetectedTotalField(detectedTotal: number) {
    let inputField: InputField = {
      name: 'detected-total',
      label: 'Detected Total:',
      type: 'text',
      value: detectedTotal.toString(),
      required: true
    };

    this.inputFields.push(inputField);
  }

  addItemFields(itemName: string, itemPrice: number, index: number) {
    let itemInputField: ItemInputField = {
      label: `Item ${index + 1}:`,
      nameName: `name-item${index + 1}`,
      nameType: 'text',
      nameValue: itemName,
      nameRequired: true,
      priceName: `price-item${index + 1}`,
      priceType: 'text',
      priceValue: itemPrice,
      priceRequired: true
    };

    this.itemInputFields.push(itemInputField);
  }

  populateFields() {
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
}
