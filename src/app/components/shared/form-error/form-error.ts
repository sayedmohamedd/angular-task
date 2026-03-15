import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-form-error',
  imports: [],
  templateUrl: './form-error.html',
})
export class FormError {
  @Input() label: any;
  @Input() name: any;
}
