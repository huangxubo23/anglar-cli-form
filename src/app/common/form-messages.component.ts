import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

import { FormValidationService } from './form-validation.service';

@Component({
  selector: 'app-form-messages',
  template: `<p class="text-danger" *ngIf="errorMessage !== null">{{errorMessage}}</p>`,
  providers: [FormValidationService]
})
export class FormMessagesComponent implements OnInit {
  @Input() control: FormControl;
  constructor() { }

  ngOnInit() {
    console.log('app-form-messages init');
  }

  get errorMessage() {
    for(let propertyName in this.control.errors) {
      // if(this.control.errors.hasOwnProperty(propertyName) && this.control.touched){
      if(this.control.errors.hasOwnProperty(propertyName) && this.control.dirty){
        return FormValidationService.getValidatorErrorMessage(propertyName, this.control.errors[propertyName]);
      }
    }
  }
}
