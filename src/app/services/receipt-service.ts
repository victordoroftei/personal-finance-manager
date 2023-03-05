import {Injectable} from "@angular/core";
import {BehaviorSubject} from "rxjs";
import {UserModel} from "../models/user.model";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Router} from "@angular/router";

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

}
