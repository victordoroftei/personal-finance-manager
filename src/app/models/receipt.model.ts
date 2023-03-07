export class ReceiptModel {
  constructor(private itemNames: Array<string>, private itemPrices: Array<number>, private calculatedTotal: number | null,
              private detectedTotal: number | null, private retailer: string | null, private imagePath: string | null, private receiptDate: string | null) {

  }

  set setItemNames(value: Array<string>) {
    this.itemNames = value;
  }

  set setItemPrices(value: Array<number>) {
    this.itemPrices = value;
  }

  set setCalculatedTotal(value: number) {
    this.calculatedTotal = value;
  }

  set setDetectedTotal(value: number) {
    this.detectedTotal = value;
  }

  set setRetailer(value: string) {
    this.retailer = value;
  }

  set setImagePath(value: string) {
    this.imagePath = value;
  }

  set setReceiptDate(value: string) {
    this.receiptDate = value;
  }
}
