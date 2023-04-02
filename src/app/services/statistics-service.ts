import {Injectable} from "@angular/core";
import {HttpClient, HttpResponse} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})

export class StatisticsService {

  token = localStorage.getItem("token");

  statisticsUrl: string = "http://localhost:8080/statistics";

  constructor(private httpClient: HttpClient) {
  }

  getStatistics(year: number, month: number) {
    let url = this.statisticsUrl + `?year=${year}&month=${month}`;
    return this.httpClient.get<HttpResponse<any>>(url, {
      headers: {
        "Authorization": "Bearer " + this.token,
        "Content-Type": "application/json"
      },
      observe: "response" as "body"
    });
  }

  getYearlyStatisticsByMonth(year: number) {
    let url = this.statisticsUrl + `/yearly?year=${year}`;
    return this.httpClient.get<HttpResponse<any>>(url, {
      headers: {
        "Authorization": "Bearer " + this.token,
        "Content-Type": "application/json"
      },
      observe: "response" as "body"
    });
  }

  getExpensesMonthly(year: number, month: number) {
    let url = this.statisticsUrl + `/expenses?year=${year}&month=${month}`;
    return this.httpClient.get<HttpResponse<any>>(url, {
      headers: {
        "Authorization": "Bearer " + this.token,
        "Content-Type": "application/json"
      },
      observe: "response" as "body"
    });
  }
}
