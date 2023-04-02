import {Injectable} from "@angular/core";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {ExpenseModel} from "../models/expense.model";

@Injectable({
  providedIn: 'root'
})

export class ExpenseService {

  token = localStorage.getItem("token");

  expensesUrl: string = "http://localhost:8080/expenses";

  constructor(private httpClient: HttpClient) {

  }

  addExpense(expense: ExpenseModel) {
    let url = this.expensesUrl;

    return this.httpClient.post<HttpResponse<any>>(url, expense, {
      headers: {
        "Authorization": "Bearer " + this.token,
        "Content-Type": "application/json"
      },
      observe: "response" as "body"
    });
  }

  getPossibleYears() {
    let url = this.expensesUrl + "/years";

    return this.httpClient.get<HttpResponse<any>>(url, {
      headers: {
        "Authorization": "Bearer " + this.token,
        "Content-Type": "application/json"
      },
      observe: "response" as "body"
    });
  }
}
