import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { FormValidationService } from '../common/form-validation.service';
import { NewUser } from './new-user';
import { Observable } from 'rxjs/Observable';
import { SignupService } from './signup.service';

interface ISuccessData {
  status: String;
  data: Object
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
    this.signupService.createUser(this.newUserForm.value).subscribe((success: ISuccessData) => {
      switch (success.status) {
        case 'successed':
          console.log(success.data)
          break;
        case 'invalidForm':
          if (Object.prototype.toString.call(success.data) === '[object Object]') {
            for (const name in success.data) {
              if (!success.data.hasOwnProperty(name))
                return;

              const data = success.data[name];
              this.newUserForm.controls[data.param] && this.newUserForm.controls[data.param].setErrors({
                invalidForm: data.msg
              });
            }
          }
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
