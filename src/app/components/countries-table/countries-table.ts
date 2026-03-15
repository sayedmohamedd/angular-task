import { Component, computed, OnInit, signal } from '@angular/core';
import { CountriesService } from '../../services/countries.service';
import { CommonModule } from '@angular/common';
import { CountriesSkeleton } from '../countries-skeleton/countries-skeleton';
import { PreviewSection } from '../preview-section/preview-section';
import { Country } from '../../models/country.model';
import { UpdateDialog } from '../update-dialog/update-dialog';
import { CountryFieldPipe } from '../../core/pipes/country-field.pipe';
import { Auth } from '../../services/auth.service';

@Component({
  selector: 'app-countries-table',
  imports: [CommonModule, CountriesSkeleton, PreviewSection, UpdateDialog, CountryFieldPipe],
  templateUrl: './countries-table.html',
  styleUrls: ['./countries-table.css'],
})
export class CountriesTable implements OnInit {
  constructor(
    private _countriesService: CountriesService,
    protected authService: Auth,
  ) {}

  // DATA
  countries = signal<Country[]>([]);
  loading = signal(true);
  /** Used for mobile skeleton placeholder count */
  readonly mobileSkeletonRows = [1, 2, 3, 4, 5];

  // PAGINATION
  page = signal(1);
  pageSize = signal(10);

  totalPages = computed(() => Math.ceil(this.countries().length / this.pageSize()));

  // SORTING
  sortField = signal<string>('name');
  sortDirection = signal<'asc' | 'desc'>('asc');

  // filter
  filters = signal({
    name: '',
    capital: '',
    continent: '',
    currency: '',
  });

  // DISPLAYED DATA
  displayedCountries = computed(() => {
    let data = [...this.countries()];

    const f = this.filters();

    // FILTER
    data = data.filter((country) => {
      const name = this.getFieldValue(country, 'name')?.toLowerCase() || '';
      const capital = this.getFieldValue(country, 'capital')?.toLowerCase() || '';
      const continent = this.getFieldValue(country, 'continent')?.toLowerCase() || '';
      const currency = this.getFieldValue(country, 'currency')?.toLowerCase() || '';

      return (
        name.includes(f.name.toLowerCase()) &&
        capital.includes(f.capital.toLowerCase()) &&
        continent.includes(f.continent.toLowerCase()) &&
        currency.includes(f.currency.toLowerCase())
      );
    });

    // SORT
    const field = this.sortField();
    const direction = this.sortDirection();

    data.sort((a, b) => {
      const aVal = this.getFieldValue(a, field) ?? '';
      const bVal = this.getFieldValue(b, field) ?? '';

      const result = String(aVal).localeCompare(String(bVal));

      return direction === 'asc' ? result : -result;
    });

    // PAGINATION
    const start = (this.page() - 1) * this.pageSize();
    const end = start + this.pageSize();

    return data.slice(start, end);
  });

  setFilter(field: string, value: string) {
    this.filters.update((f) => ({
      ...f,
      [field]: value,
    }));

    this.page.set(1);
  }

  // SELECTED ROW
  selected = signal<Country | null>(null);

  // Pop Up
  showUpdateDialog = signal(false);
  showDeleteDialog = signal(false);

  // SORT (direction optional: when provided e.g. from mobile dropdown, set both; otherwise toggle)
  sortBy(field: string, direction?: 'asc' | 'desc') {
    if (direction !== undefined) {
      this.sortField.set(field);
      this.sortDirection.set(direction);
    } else if (this.sortField() === field) {
      this.sortDirection.update((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      this.sortField.set(field);
      this.sortDirection.set('asc');
    }
    this.selected.set(null);
  }

  getFieldValue(country: Country, field: string): any {
    switch (field) {
      case 'name':
        return country.name?.common;

      case 'capital':
        return country.capital?.[0];

      case 'continent':
        return country.continents?.[0];

      case 'currency':
        const key = Object.keys(country.currencies ?? {})[0];
        return country.currencies?.[key]?.name;

      default:
        return '';
    }
  }

  // PAGINATION
  prevPage() {
    if (this.page() > 1) {
      this.page.update((p) => p - 1);
      this.selected.set(null);
    }
  }

  nextPage() {
    if (this.page() < this.totalPages()) {
      this.page.update((p) => p + 1);
      this.selected.set(null);
    }
  }

  // CHANGE PAGE SIZE
  changePageSize(size: number) {
    this.pageSize.set(size);
    this.page.set(1);
    this.selected.set(null);
  }

  handleLimitChange(event: any) {
    this.changePageSize(+event.target.value);
  }

  // SELECT ROW
  selectCountry(country: Country) {
    if (this.selected()?.name.common === country?.name?.common) {
      this.selected.set(null);
      return;
    }
    this.selected.set(country);
  }

  // DELETE
  deleteCountry(country: Country | any) {
    this.countries.update((c) => c.filter((item) => item.name.common !== country.name.common));
    this.selected.set(null);
    this.showDeleteDialog.set(false);
  }

  // UPDATE
  updateCountry(formData: any) {
    // Format data
    formData.currencies = {[formData.currencies.code]: {name:formData.currencies.name}};
    formData.languages = { '': formData.languages };

    // Update
    this.countries.update((countries) => {
      const index = countries.findIndex((c) => c.name.common === this.selected()?.name.common);

      if (index === -1) return countries;

      const updated = [...countries];

      updated[index] = {
        ...updated[index],
        ...formData,
        capital: [formData.capital],
        continents: Array.isArray(formData.continents)
          ? formData.continents
          : [formData.continents],
      };

      this.selected.set(updated[index]);

      return updated;
    });
  }

  // INIT
  ngOnInit(): void {
    this._countriesService.getCountries().subscribe({
      next: (data: any) => {
        this.countries.set(data);
      },
      error: (err: any) => {
        console.error(err);
      },
      complete: () => {
        this.loading.set(false);
      },
    });
  }
}
