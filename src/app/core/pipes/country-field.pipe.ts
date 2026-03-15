import { Pipe, PipeTransform } from '@angular/core';
import { Country } from '../../models/country.model';

@Pipe({
  name: 'countryField',
  standalone: true,
  pure: true
})
export class CountryFieldPipe implements PipeTransform {

  transform(country: Country | null | undefined, field: string): string {
    if (!country) return '-';

    switch (field) {
      case 'name':
        return country?.name?.common ?? '-';

      case 'capital':
        return country?.capital?.[0] ?? '-';

      case 'continent':
        return country?.continents?.[0] ?? '-';

      case 'currency': {
        const key = Object.keys(country?.currencies ?? {})?.[0];
        return country?.currencies?.[key]?.name ?? '-';
      }

      case 'languages':
        return Object.values(country?.languages ?? {}).join(', ') || '-';

      case 'subregion':
        return country?.subregion ?? '-';

      case 'status':
        return country?.status ?? '-';

      case 'independent':
        return country?.independent ? 'Yes' : 'No';

      default:
        return '-';
    }
  }
}
