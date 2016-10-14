import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { ResetPasswordUser } from './reset-password';
import { ResetPasswordService } from './reset-password.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css'],
  providers: [ResetPasswordService]
})
export class ResetPasswordComponent implements OnInit {
  user = new ResetPasswordUser(null, null, null);
  errMsg: string = null;
  constructor(private resetPasswordService: ResetPasswordService) { }

  ngOnInit() {

  }

  onSubmit(resetForm: FormGroup) {
    this.errMsg = null;
    if (resetForm.invalid)
      return this.errMsg = 'Form is not valid';

    this.resetPasswordService.resetPassword(this.user).subscribe((response: any) => {
      console.log(response);
      localStorage.setItem('id_token', response.token);
    }, (error) => {
      if (error.hasOwnProperty('status') && error.status === 'invalidParam') {
        //error.messages is Object
        for (let name in error.messages) {
          if (!error.messages.hasOwnProperty(name))
            return;
          
          const message: IMessage = error.messages[name];
          resetForm.controls[message.param].setErrors({
            invalidForm: message.msg
          });
        }
      } else if (error.hasOwnProperty('status') && error.status === 'invalidForm') {
        //error.messages is Array
        error.messages.map((message: IMessage) => {
          resetForm.controls[message.param].setErrors({
            invalidForm: message.msg
          });
        });
      } else {
        this.errMsg = (error.messages) ? error.messages : error.status ? `${error.status} - ${error.statusText}` : 'Server error';
      }
    })
  }
}

interface IMessage {
  param: string;
  msg: string;
  value: any;
  error?: boolean;
}