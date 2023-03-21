export class ReceiptModel {
  constructor(public itemNames: Array<string>, public itemPrices: Array<number>, public calculatedTotal: number | null,
              public detectedTotal: number | null, public retailer: string | null, public imagePath: string | null, public receiptDate: string | null) {

  }
}
