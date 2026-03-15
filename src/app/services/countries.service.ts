import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const API_URL = 'https://restcountries.com/v3.1/all?fields=name,independent,status,currencies,capital,region,subregion,languages,continents';

@Injectable({
  providedIn: 'root',
})
export class CountriesService {
  constructor(private _http: HttpClient) {}

  getCountries() {
    return this._http.get(API_URL);
  }

}
