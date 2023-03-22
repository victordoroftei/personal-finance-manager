import { Component } from '@angular/core';
import {StatisticsService} from "../../../services/statistics-service";
import {PercentageModel} from "../../../models/percentage.model";
import {ChartType, Row} from "angular-google-charts";

@Component({
  selector: 'app-spending-statistics',
  templateUrl: './spending-statistics.component.html',
  styleUrls: ['./spending-statistics.component.css']
})
export class SpendingStatisticsComponent {

  percentageModel: PercentageModel = {
    receipts: 0,
    invoices: 0,
    expenses: 0
  };

  title: string = "";

  type: ChartType = ChartType.PieChart;

  data: Row[] = [];

  columnNames: string[] = [];

  options: object = {};

  width: number = 100;

  height: number = 100;


  constructor(private statisticsService: StatisticsService) {

  }

  ngOnInit() {
    this.statisticsService.getStatistics().subscribe(data => {
      this.percentageModel = data.body;

      this.title = 'Breakdown of your spending';

      this.type = ChartType.PieChart;

      this.data = [
          ['Receipts', this.percentageModel.receipts],
          ['Invoices', this.percentageModel.invoices],
          ['Expenses', this.percentageModel.expenses]
        ];

      this.columnNames = ['Expense Type', 'Percentage'];

      this.options = {
      };

      this.width = 550;

      this.height = 400;
    });
  }
}
