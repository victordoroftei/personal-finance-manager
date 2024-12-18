import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {AuthGuard} from "./components/login/auth.guard";
import {MainViewComponent} from "./components/main-view/main-view.component";
import {ReceiptFormComponent} from "./components/main-view/receipt-form/receipt-form.component";
import {FileUploadComponent} from "./components/main-view/file-upload/file-upload.component";
import {MainPageComponent} from "./components/main-view/main-page/main-page.component";
import {RegisterComponent} from "./components/register/register.component";
import {ManageReceiptsComponent} from "./components/main-view/manage-receipts/manage-receipts.component";
import {SpendingStatisticsComponent} from "./components/main-view/spending-statistics/spending-statistics.component";
import {ManageAccountComponent} from "./components/main-view/manage-account/manage-account.component";
import {TestPageComponent} from "./components/main-view/test-page/test-page.component";
import {AddInvoiceComponent} from "./components/main-view/add-invoice/add-invoice.component";
import {ManageInvoicesComponent} from "./components/main-view/manage-invoices/manage-invoices.component";
import {AddExpenseComponent} from "./components/main-view/add-expense/add-expense.component";
import {ManageExpensesComponent} from "./components/main-view/manage-expenses/manage-expenses.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'main-view/main-page',
    pathMatch: 'full'
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'main-view',
    component: MainViewComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'main-page',
        pathMatch: 'full'
      },
      {
        path: "main-page",
        component: MainPageComponent,
      },
      {
        path: "receipt-form",
        component: ReceiptFormComponent
      },
      {
        path: "file-upload",
        component: FileUploadComponent
      },
      {
        path: "manage-receipts",
        component: ManageReceiptsComponent
      },
      {
        path: "spending-statistics",
        component: SpendingStatisticsComponent
      },
      {
        path: "manage-account",
        component: ManageAccountComponent
      },
      {
        path: "add-invoice",
        component: AddInvoiceComponent
      },
      {
        path: "manage-invoices",
        component: ManageInvoicesComponent
      },
      {
        path: "add-expense",
        component: AddExpenseComponent
      },
      {
        path: "manage-expenses",
        component: ManageExpensesComponent
      },
      {
        path: "test-page",
        component: TestPageComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule {

}

export const RoutingComponents = [LoginComponent, MainViewComponent, ReceiptFormComponent, FileUploadComponent, MainPageComponent];
