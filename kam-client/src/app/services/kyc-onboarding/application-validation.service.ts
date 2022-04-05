import { Injectable } from '@angular/core';
import { ValidatorFn, AbstractControl, ValidationErrors, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ApplicationValidationService {
  phonePattern = RegExp(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/);
  postalCodePattern = RegExp(`^[0-9]{5}(?:-[0-9]{4})?$`);
  poiFilePattern = RegExp(`^.*\.(jpg|JPG|jpeg|JPEG|png|PNG)$`);
  poaFilePattern = RegExp(`^.*\.(jpg|JPG|jpeg|JPEG|png|PNG|doc|DOC|pdf|PDF)$`);

  constructor() { }

  checkPermanentAddress: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => { 
    let isSame = group.get('isSameAddress').value;
    
    if (isSame == 'NO') {
      return Validators.required(group.get('permanentAddress')) ? { addressRequired: true } : null;
    }
    return null;
  }

  checkPermanentCity: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => { 
    let isSame = group.get('isSameAddress').value;
    
    if (isSame == 'NO') {
      return Validators.required(group.get('permanentCity')) ? { cityRequired: true } : null;
    }
    return null;
  }

  checkPermanentState: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => { 
    let isSame = group.get('isSameAddress').value;
    
    if (isSame == 'NO') {
      return Validators.required(group.get('permanentState')) ? { stateRequired: true } : null;
    }
    return null;
  }

  checkPermanentPostalCode: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => { 
    let isSame = group.get('isSameAddress').value;
    
    if (isSame == 'NO') {
      return Validators.required(group.get('permanentPostalCode')) ? { postalCodeRequired: true } : null;
    }
    return null;
  }

  checkPermanentCountry: ValidatorFn = (group: AbstractControl):  ValidationErrors | null => { 
    let isSame = group.get('isSameAddress').value;
    
    if (isSame == 'NO') {
      return Validators.required(group.get('permanentCountry')) ? { countryRequired: true } : null;
    }
    return null;
  }
}