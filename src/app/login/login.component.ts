import { Component, OnInit, OnDestroy, trigger, state, animate, transition, style } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../common/auth.service';
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
  constructor(
    private router: Router,
    private authService: AuthService,
    private loginService: LoginService) {

  }

  ngOnInit() {
    setTimeout(() => {
      this.animationState = true;
    });
  }

  ngOnDestroy() {
    this.animationState = false;
  }

  onSubmit(loginForm: FormGroup) {
    if (loginForm.invalid)
      return this.errMsg = 'Email and Password are required';

    this.loginService.login(this.user).subscribe((response: any) => {
      this.authService.setToken(response.token);
      //localStorage.setItem('id_token', response.token);
      this.router.navigate(['reset']);
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
  }
}

interface IMessage {
  param: string;
  msg: string;
  value: any;
  error?: boolean;
}