import { Component, OnInit, OnDestroy, trigger, state, animate, transition, style } from '@angular/core';

import { LoginUser } from './login-user';

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
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  animationState: boolean = false;
  user = new LoginUser(null, null);
  constructor() {
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

  onSubmit(loginForm) {
    console.log(loginForm);
    console.log(this.user);
  }

  onChangeAnimation() {
    this.animationState = this.animationState ? false : true;
    console.log(this.animationState);
  }
}
