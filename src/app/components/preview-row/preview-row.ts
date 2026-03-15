import { Component, Input } from '@angular/core';
import { Country } from '../../models/country.model';
import { CountryFieldPipe } from '../../core/pipes/country-field.pipe';

@Component({
  selector: 'app-preview-row',
  imports: [CountryFieldPipe],
  templateUrl: './preview-row.html',
})
export class PreviewRow {
  @Input() country!: Country
}
