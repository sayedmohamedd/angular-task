import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const API_URL = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies.json';

@Injectable({
  providedIn: 'root',
})
export class CurrencyService {
  constructor(private _http: HttpClient) {}

  getCurrencies() {
    return this._http.get(API_URL);
  }
}
