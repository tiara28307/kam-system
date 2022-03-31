import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ApplicationValidationService {
  phonePattern = RegExp(/\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/);
  postalCodePattern = RegExp(`^[0-9]{5}(?:-[0-9]{4})?$`);
  poiFilePattern = RegExp(`^.*\.(jpg|JPG|jpeg|JPEG|png|PNG)$`);
  poaFilePattern = RegExp(`^.*\.(jpg|JPG|jpeg|JPEG|png|PNG|doc|DOC|pdf|PDF)$`);

  constructor() { }
}
