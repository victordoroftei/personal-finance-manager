import { Component, OnInit } from '@angular/core';
import {LoginService} from "../../../services/login-service";

@Component({
  selector: 'app-main-navbar',
  templateUrl: './main-navbar.component.html',
  styleUrls: ['./main-navbar.component.css']
})
export class MainNavbarComponent implements OnInit {

  constructor(private loginService: LoginService) {

  }

  ngOnInit(): void {

  }

  logout() {
    this.loginService.logout();
  }
}
