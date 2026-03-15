import { Pipe, PipeTransform } from '@angular/core';
import { Country } from '../../models/country.model';

@Pipe({
  name: 'currenciesPipe',
  standalone: true,
  pure: true,
})
export class CurrenciesPipe implements PipeTransform {
  transform(currencies: Country | null | undefined): any {
    if (!currencies) return [];
    return Object.entries(currencies ?? []);
  }
}
