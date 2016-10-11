import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { FormValidationService } from '../common/form-validation.service';
import { NewUser } from './new-user';
import { Observable } from 'rxjs/Observable';
import { SignupService } from './signup.service';

interface IResponseData {
  status: string;
  data?: any;
  token?: string;
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  providers: [SignupService],
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  newUser: NewUser;
  newUserForm: FormGroup;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private signupService: SignupService
  ) {
    this.newUser = new NewUser();
    console.log(this.newUser);
  }

  ngOnInit() {
    console.log('signup init');
    let formGroupObj = this.generateForm(this.newUser);
    this.newUserForm = this.formBuilder.group(formGroupObj);
  }

  onSubmit() {
    if (this.newUserForm.invalid) {
      for (const name in this.newUserForm.controls) {
        this.newUserForm.controls[name].pristine && this.newUserForm.controls[name].markAsDirty();
      }
      return false;
    }

    console.log(this.newUserForm.value);
    this.signupService.createUser(this.newUserForm.value).subscribe((response: IResponseData) => {
      switch (response.status) {
        case 'invalidForm':
          if (Object.prototype.toString.call(response.data) === '[object Object]') {
            for (const name in response.data) {
              if (!response.data.hasOwnProperty(name))
                return;

              const data = response.data[name];
              this.newUserForm.controls[data.param] && this.newUserForm.controls[data.param].setErrors({
                invalidForm: data.msg
              });
            }
          }
          break;
        case 'successed':
          localStorage.setItem('id_token', response.token);
          this.router.navigate(['login']);
          break;
        default:
          break;
      }
    }, (error: any) => {
      console.log(error);
    });
  }

  generateForm(data: NewUser) {
    let formGroupObj = {};
    for (let property in data) {
      if (!data.hasOwnProperty(property))
        return;

      var formCtrlValidators = [];
      switch (property) {
        case 'userName':
        case 'password':
        case 'confirmPassword':
          formCtrlValidators.push(Validators.required);
          formGroupObj[property] = [this.newUser[property], formCtrlValidators];
          break;
        case 'email':
          formCtrlValidators.push(Validators.required);
          formCtrlValidators.push(FormValidationService.emailValidator);
          formGroupObj[property] = [this.newUser[property], formCtrlValidators];
          break;
        case 'age':
          formCtrlValidators.push(FormValidationService.integerValidator(0, 150));
          formGroupObj[property] = [this.newUser[property], formCtrlValidators];
          break;
        default:
          break;
      }
    }

    return formGroupObj;
  }

}
