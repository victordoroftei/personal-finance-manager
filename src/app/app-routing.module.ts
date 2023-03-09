import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./components/login/login.component";
import {AuthGuard} from "./components/login/auth.guard";
import {MainViewComponent} from "./components/main-view/main-view.component";
import {ReceiptFormComponent} from "./components/main-view/receipt-form/receipt-form.component";
import {FileUploadComponent} from "./components/main-view/file-upload/file-upload.component";
import {MainPageComponent} from "./components/main-view/main-page/main-page.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'main-view/main-page',
    pathMatch: 'full'
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
        path: "receipt-form",
        component: ReceiptFormComponent
      },
      {
        path: "file-upload",
        component: FileUploadComponent
      },
      {
        path: "main-page",
        component: MainPageComponent
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

export const RoutingComponents = [LoginComponent, MainViewComponent, ReceiptFormComponent];
