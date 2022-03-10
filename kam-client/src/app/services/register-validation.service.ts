import { Injectable } from '@angular/core';
import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class RegisterValidationService {

  constructor() { }

  urlPattern = RegExp(`https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,}`);
  phonePattern = RegExp(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/);
  postalCodePattern = RegExp(`^[0-9]{5}(?:-[0-9]{4})?$`);
  passwordPattern = RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/);

  checkCustomerPasswords: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => { 
    let pass = group.get('customerPass').value;
    let confirmPass = group.get('customerPassConfirm').value
    return pass === confirmPass ? null : { notSame: true }
  }

  checkEmployeePasswords: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => { 
    let pass = group.get('employeePass').value;
    let confirmPass = group.get('employeePassConfirm').value
    return pass === confirmPass ? null : { notSame: true }
  }

}
