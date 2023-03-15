import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule, RoutingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { MainViewComponent } from './components/main-view/main-view.component';
import { ReceiptFormComponent } from './components/main-view/receipt-form/receipt-form.component';
import {LoginService} from "./services/login-service";
import {HttpClientModule} from "@angular/common/http";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { LoadingSpinnerLoginComponent } from './components/utils/loading-spinner-login/loading-spinner-login.component';
import { FileUploadComponent } from './components/main-view/file-upload/file-upload.component';
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import { MainPageComponent } from './components/main-view/main-page/main-page.component';
import { MainNavbarComponent } from './components/main-view/main-navbar/main-navbar.component';
import {MatMenuModule} from "@angular/material/menu";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import { RegisterComponent } from './components/register/register.component';
import { RegisterDialogComponent } from './components/register/register-dialog/register-dialog.component';
import {MatDialogModule} from "@angular/material/dialog";
import { ReceiptFormDialogComponent } from './components/main-view/receipt-form/receipt-form-dialog/receipt-form-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    RoutingComponents,
    LoginComponent,
    MainViewComponent,
    ReceiptFormComponent,
    LoadingSpinnerLoginComponent,
    FileUploadComponent,
    MainPageComponent,
    MainNavbarComponent,
    RegisterComponent,
    RegisterDialogComponent,
    ReceiptFormDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatProgressSpinnerModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    BrowserAnimationsModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule
  ],
  providers: [LoginService],
  bootstrap: [AppComponent]
})
export class AppModule {

}
