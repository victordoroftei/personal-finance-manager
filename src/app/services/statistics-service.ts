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

  getStatistics() {
    let url = this.statisticsUrl;
    return this.httpClient.get<HttpResponse<any>>(url, {
      headers: {
        "Authorization": "Bearer " + this.token,
        "Content-Type": "application/json"
      },
      observe: "response" as "body"
    });
  }
}
