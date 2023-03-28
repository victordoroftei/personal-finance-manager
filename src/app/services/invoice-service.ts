import {Injectable} from "@angular/core";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {InvoiceModel} from "../models/invoice.model";

@Injectable({
  providedIn: 'root'
})

export class InvoiceService {

  token = localStorage.getItem("token");

  invoicesUrl: string = "http://localhost:8080/invoices";

  constructor(private httpClient: HttpClient) {

  }

  addInvoice(invoice: InvoiceModel) {
    let url = this.invoicesUrl;

    return this.httpClient.post<HttpResponse<any>>(url, invoice, {
      headers: {
        "Authorization": "Bearer " + this.token,
        "Content-Type": "application/json"
      },
      observe: "response" as "body"
    });
  }

}
