import {Component} from '@angular/core';
import {ReceiptService} from "../../../services/receipt-service";

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})

export class MainPageComponent {

  inputFields: InputField[];
  itemInputFields: ItemInputField[];

  token!: string | null;

  constructor(private receiptService: ReceiptService) {
    this.receiptService = receiptService;

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
    this.receiptService.getAllTest().subscribe(
      data => {
        this.inputFields = [];

        if (data.body.retailer != null) {
          this.addRetailerField(data.body.retailer);
        }

        if (data.body.receiptDate != null) {
          this.addReceiptDateField(data.body.receiptDate);
        }

        if (data.body.calculatedTotal != null) {
          this.addCalculatedTotalField(data.body.calculatedTotal);
        }

        if (data.body.detectedTotal != null) {
          this.addDetectedTotalField(data.body.detectedTotal);
        }

        let itemNames: Array<string> = data.body.itemNames;
        let itemPrices: Array<number> = data.body.itemPrices;

        for (let i = 0; i < itemNames.length; i++) {
          this.addItemFields(itemNames[i], itemPrices[i], i)
        }
      }
    )
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
