import { Component, Input } from '@angular/core';
import { CountryFieldPipe } from '../../core/pipes/country-field.pipe';

@Component({
  selector: 'app-preview-section',
  imports: [CountryFieldPipe],
  templateUrl: './preview-section.html',
})
export class PreviewSection {
  @Input() country: any;
}
