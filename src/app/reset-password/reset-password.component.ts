import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

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
  constructor(
    private router: Router,
    private resetPasswordService: ResetPasswordService
    ) { }

  ngOnInit() {

  }

  onSubmit(resetForm: FormGroup) {
    this.errMsg = null;
    if (resetForm.invalid)
      return this.errMsg = 'Form is not valid';

    this.resetPasswordService.resetPassword(this.user).subscribe((response: any) => {
      console.log(response);
      localStorage.setItem('id_token', response.token);
      this.router.navigate(['home']);
    }, (error) => {
      if (error.hasOwnProperty('status') && error.status === 'invalidForm') {
        error.messages.map((message: IMessage) => {
          resetForm.controls[message.param].setErrors({
            invalidForm: message.msg
          });
        });
      } else if (error.hasOwnProperty('status') && error.status === 'tokenExpired') {
        alert(error.messages);
        this.router.navigate(['login']);
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