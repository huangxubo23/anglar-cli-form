import { Component, OnInit } from '@angular/core';

import { ResetPassword } from './reset-password';
//import { FormMessagesComponent } from '../common/form-messages.component'

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
  //viewProviders: [FormMessagesComponent]
})
export class ResetPasswordComponent implements OnInit {
  user = new ResetPassword(null, null, null);
  constructor() { }

  ngOnInit() {

  }

  onSubmit(from) {
    console.log(from);
    console.log(this.user);
  }
}
