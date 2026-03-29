import { Component, EventEmitter, Input, Output, WritableSignal, signal } from '@angular/core';
import { CountryFieldPipe } from '../../core/pipes/country-field.pipe';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Country, Currency } from '../../models/country.model';
import { CurrencyService } from '../../services/currency.service';
import { FormError } from '../shared/form-error/form-error';
import { NgClass } from '@angular/common';
import { CurrenciesPipe } from '../../core/pipes/currencies.pipe';

@Component({
  selector: 'app-update-dialog',
  imports: [CountryFieldPipe, ReactiveFormsModule, FormError, NgClass, CurrenciesPipe],
  templateUrl: './update-dialog.html',
})
export class UpdateDialog {
  private _country!: Country;
  formData: FormGroup;
  currencies = signal<any>([]);

  constructor(
    private _formBuilder: FormBuilder,
    private _currencyService: CurrencyService,
  ) {
    this.formData = this._formBuilder.group({
      name: this._formBuilder.group({
        common: ['', Validators.required],
      }),
      independent: false,
      capital: ['', Validators.required],
      status: '',
      subregion: ['', Validators.required],
      continents: ['', Validators.required],
      languages: ['', Validators.required],
      currencies: this._formBuilder.group({
        code: ['', Validators.required],
        name: '',
        symbol: '',
      }),
    });
  }

  @Input() set country(value: Country | any) {
    this._country = value;
    if (value) {
      this.formData.reset({
        name: {
          common: value.name.common,
        },
        independent: value.independent,
        capital: value.capital?.[0],
        status: value.status,
        subregion: value.subregion,
        continents: value.continents,
        languages: Object.values(value.languages).join(', '),
        currencies: {
          code: (Object.keys(value.currencies ?? {})?.[0] ?? '').toLowerCase(),
          name: '',
          symbol: '',
        },
      });
    }
  }

  @Input() isOpen!: WritableSignal<boolean>;
  @Output() save = new EventEmitter<any>();

  onSave() {
    if (this.formData.valid) {
      // PATCH Currencies
      const code = this.formData.get('currencies')?.value.code;
      this.formData.get('currencies')?.patchValue({
        code: code,
        name: this.currencies()[code],
      });
      //  EMIT UPDATED COUNTRY
      this.save.emit(this.formData.value);
      // CLOSE DIALOG
      this.isOpen.set(false);
    } else {
      // MARK ALL FIELDS AS TOUCHED TO SHOW VALIDATION ERRORS
      this.formData.markAllAsTouched();
      this.formData.markAsDirty();
    }
  }

  ngOnInit(): void {
    // GET Currencies
    this._currencyService.getCurrencies().subscribe({
      next: (data: any) => {
        this.currencies.set(data);
      },
      error: (err: any) => {
        console.error(err);
      },
    });
  }
}
