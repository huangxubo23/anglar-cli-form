import { Component, OnInit } from '@angular/core';

import { LoginUser } from './login-user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user = new LoginUser(null, null);
  constructor() {
    console.log(this.user);
  }

  ngOnInit() {
    console.log('init component');
  }

  onSubmit(loginForm) {
    console.log(loginForm);
    console.log(this.user);
  }
}
