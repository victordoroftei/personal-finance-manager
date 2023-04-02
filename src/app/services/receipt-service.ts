import {Injectable} from "@angular/core";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {ReceiptModel} from "../models/receipt.model";

@Injectable({
  providedIn: 'root'
})

export class ReceiptService {

  token = localStorage.getItem("token");

  receiptsUrl: string = "http://localhost:8080/receipts";

  constructor(private httpClient: HttpClient) {

  }

  getAllTest() {
    let url = this.receiptsUrl + "/all";
    return this.httpClient.get<HttpResponse<any>>(url, {
      headers: {
        "Authorization": "Bearer " + this.token,
        "Content-Type": "application/json"
      },
      observe: "response" as "body"
    });
  }

  getPossibleYears() {
    let url = this.receiptsUrl + "/years";
    return this.httpClient.get<HttpResponse<any>>(url, {
      headers: {
        "Authorization": "Bearer " + this.token
      },
      observe: "response" as "body"
    });
  }

  getReceiptsForMonthAndYear(year: number, month: number) {
    let url = `${this.receiptsUrl}/date?year=${year}&month=${month}`;
    return this.httpClient.get<HttpResponse<any>>(url, {
      headers: {
        "Authorization": "Bearer " + this.token
      },
      observe: "response" as "body"
    });
  }

  uploadFile(data: FormData) {
    let url = this.receiptsUrl + "/upload";

    return this.httpClient.post<HttpResponse<any>>(url, data, {
      headers: {
        "Authorization": "Bearer " + this.token,
      },
      observe: "response" as "body"
    });
  }

  addReceipt(receipt: ReceiptModel) {
    let url = this.receiptsUrl;
    return this.httpClient.post<HttpResponse<any>>(url, receipt, {
      headers: {
        "Authorization": "Bearer " + this.token,
        "Content-Type": "application/json"
      },
      observe: "response" as "body"
    });
  }

  getImage(imagePath: string) {
    let url = this.receiptsUrl + `/image/${imagePath}`
    return this.httpClient.get<HttpResponse<any>>(url, {
      responseType: "blob" as "json",
      headers: {
        "Authorization": "Bearer " + this.token,
        "Content-Type": "application/json"
      },
      observe: "response" as "body"
    });
  }
}
