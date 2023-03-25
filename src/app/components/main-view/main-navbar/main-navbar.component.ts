import { Component, OnInit } from '@angular/core';
import {UserService} from "../../../services/user-service";

@Component({
  selector: 'app-main-navbar',
  templateUrl: './main-navbar.component.html',
  styleUrls: ['./main-navbar.component.css']
})
export class MainNavbarComponent implements OnInit {

  constructor(private userService: UserService) {

  }

  ngOnInit(): void {

  }

  logout() {
    this.userService.logout();
  }
}
