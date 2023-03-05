import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule, RoutingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import {ReactiveFormsModule} from "@angular/forms";
import { MainViewComponent } from './components/main-view/main-view.component';
import { MainPageComponent } from './components/main-view/main-page/main-page.component';
import {LoginService} from "./services/login-service";
import {HttpClientModule} from "@angular/common/http";
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import { LoadingSpinnerLoginComponent } from './components/utils/loading-spinner-login/loading-spinner-login.component';

@NgModule({
  declarations: [
    AppComponent,
    RoutingComponents,
    LoginComponent,
    MainViewComponent,
    MainPageComponent,
    LoadingSpinnerLoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatProgressSpinnerModule
  ],
  providers: [LoginService],
  bootstrap: [AppComponent]
})
export class AppModule {

}
