import {Injectable} from "@angular/core";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {InvoiceModel} from "../models/invoice.model";
import {InvoiceEntity} from "../models/invoice.entity";

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

  getPossibleYears() {
    let url = this.invoicesUrl + "/years";
    return this.httpClient.get<HttpResponse<any>>(url, {
      headers: {
        "Authorization": "Bearer " + this.token
      },
      observe: "response" as "body"
    });
  }

  getInvoicesForMonthAndYear(year: number, month: number) {
    let url = `${this.invoicesUrl}/date?year=${year}&month=${month}`;
    return this.httpClient.get<HttpResponse<any>>(url, {
      headers: {
        "Authorization": "Bearer " + this.token
      },
      observe: "response" as "body"
    });
  }

  getDueInvoices() {
    let url = `${this.invoicesUrl}/due`;
    return this.httpClient.get<HttpResponse<any>>(url, {
      headers: {
        "Authorization": "Bearer " + this.token
      },
      observe: "response" as "body"
    });
  }

  payInvoice(invoice: InvoiceEntity) {
    invoice.dueDate = "2023-03-09T10:00:00";
    let url = this.invoicesUrl;
    return this.httpClient.patch<HttpResponse<any>>(url, invoice, {
      headers: {
        "Authorization": "Bearer " + this.token,
        "Content-Type": "application/json"
      },
      observe: "response" as "body"
    });
  }
}
