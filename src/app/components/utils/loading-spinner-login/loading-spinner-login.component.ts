import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-loading-spinner-login',
  template: '<div class="lds-ring"><div></div><div></div><div></div><div></div></div>',
  styleUrls: ['./loading-spinner-login.component.css']
})
export class LoadingSpinnerLoginComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

}
