import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';

interface ValidationResult {
  [key: string]: any;
}

@Injectable()
export class FormValidationService {

  constructor() { }

  static getValidatorErrorMessage(validatorName: string, validatorValue?: any) {
    let config = {
      'required': 'This field is required',
      'invalidCreditCard': 'Is invalid credit card number',
      'invalidEmailAddress': 'Invalid email address',
      'invalidPassword': 'Invalid password. Password must be at least 6 characters long, and contain a number',
      'minlength': `Minimum length ${validatorValue.requiredLength}, current length is ${validatorValue.actualLength}`,
      'maxlength': `Maximum length ${validatorValue.requiredLength}, current length is ${validatorValue.actualLength}`,
      'max': `Max limit is ${validatorValue.requiredMax}`,
      'min': `Min limit is ${validatorValue.requiredMin}`,
      'invalid': 'Current value is invalid',
      'invalidForm': validatorValue
    };
    return config[validatorName];
  }

  static creditCardValidator(control: FormControl): ValidationResult {
    // Visa, MasterCard, American Express, Diners Club, Discover, JCB
    if (control.value.match(/^(?:4[0-9]{12}(?:[0-9]{3})?|5[1-5][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/)) {
      return null;
    } else {
      return {
        'invalidCreditCard': true
      };
    }
  }

  static emailValidator(control: FormControl): ValidationResult {
    // RFC 2822 compliant regex
    if (typeof(control.value) === 'string' && control.value.match(/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/)) {
      return null;
    } else {
      return {
        'invalidEmailAddress': true
      };
    }
  }

  static isNumeric(value: any) {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }

  static isInteger(value: any) {
    return this.isNumeric(value) &&  Math.floor(value) === parseFloat(value);
  }

  static doubleValidator(min: number, max: number): Function {
    const _this = this;

    return (control: FormControl): ValidationResult => {
      if(control.value === null || control.value === '')
        return null;

      if(_this.isNumeric(control.value)){
        if(_this.isNumeric(min)){
          if(min > control.value){
            return {
              'min' : {
                'requiredMin': min,
                'actualMin': control.value
              }
            }
          }
        }
        if(_this.isNumeric(max)){
          if(control.value > max){
            return {
              'max' : {
                'requiredMax': max,
                'actualMax': control.value
              }
            }
          }
        }

        return null;
      } else {
        return {
          'invalid': true
        };
      }

    }
  }

  static integerValidator(min: number, max: number): Function {
    const _this = this;

    return (control: FormControl):ValidationResult => {
      if(control.value === null || control.value === '')
        return null;

      //let INTEGER_REGEXP =  /^[-+]?[0-9]+[0-9]*]*$/;
      if(_this.isInteger(control.value)){
        if(_this.isNumeric(min)){
          if(min > control.value){
            return {
              'min' : {
                'requiredMin': min,
                'actualMin': control.value
              }
            }
          }
        }
        if(_this.isNumeric(max)){
          if(control.value > max){
            return {
              'max' : {
                'requiredMax': max,
                'actualMax': control.value
              }
            }
          }
        }

        return null;
      } else {
        return {
          'invalid': true
        }
      }

    }
  }

  static passwordValidator(control: FormControl): ValidationResult {
    // {6,100}           - Assert password is between 6 and 100 characters
    // (?=.*[0-9])       - Assert a string has at least one number
    if (control.value.match(/^(?=.*[0-9])[a-zA-Z0-9!@#$%^&*]{6,100}$/)) {
      return null;
    } else {
      return {
        'invalidPassword': true
      };
    }
  }

}
