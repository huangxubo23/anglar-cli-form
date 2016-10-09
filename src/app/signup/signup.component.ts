import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';

import { FormValidationService } from '../common/form-validation.service';
import { NewUser } from './new-user';
import { Observable } from 'rxjs/Observable';
import { SignupService } from './signup.service';

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

  onSubmit(data) {
    console.log(data);
    this.signupService.createUser(data).subscribe((data)=>{
      console.log(data);
    },(error)=>{
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
          formCtrlValidators.push(Validators.required);
          formGroupObj[property] = [this.newUser[property], formCtrlValidators];
          break;
        case 'email':
          formCtrlValidators.concat([Validators.required, FormValidationService.emailValidator]);
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
