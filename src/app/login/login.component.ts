import { Component, OnInit, OnDestroy, trigger, state, animate, transition, style } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { LoginUser } from './login-user';
import { LoginService } from './login.service';

@Component({
  selector: 'app-login',
  animations: [
    trigger('isVisibleChanged', [
      state('true', style({ opacity: 1, transform: 'scale(1.0)' })),
      state('false', style({ opacity: 0, transform: 'scale(0.0)' })),
      transition('1 => 0', animate('200ms')),
      transition('0 => 1', animate('500ms'))
    ])
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [LoginService]
})
export class LoginComponent implements OnInit {
  animationState: boolean = false;
  user = new LoginUser(null, null);
  errMsg: string = null;
  showErr: boolean = false;
  constructor(private loginService: LoginService) {
    console.log(this.user);
  }

  ngOnInit() {
    setTimeout(() => {
      this.animationState = true;
    });

    console.log('init component');
  }

  ngOnDestroy() {
    this.animationState = false
    console.log('OnDestroy');
  }

  onSubmit(loginForm: FormGroup) {
    if (loginForm.invalid)
      return this.errMsg = 'Email and Password are required';

    this.loginService.login(this.user).subscribe((response: any) => {
      console.log(response);
    }, (error: any) => {
      if (error.hasOwnProperty('status') && error.status === 'invalidForm') {
        error.messages.map((message: IMessage) => {
          loginForm.controls[message.param].setErrors({
            invalidForm: message.msg
          });
        });
      } else {
        this.errMsg = (error.messages) ? error.messages : error.status ? `${error.status} - ${error.statusText}` : 'Server error';
      }
    })
  }

  onChangeAnimation() {
    this.animationState = this.animationState ? false : true;
    console.log(this.animationState);
  }
}

interface IMessage {
  param: string;
  msg: string;
  value: any;
  error?: boolean;
}