import { Component } from '@angular/core';

@Component({
  selector: 'app-countries-skeleton',
  imports: [],
  templateUrl: './countries-skeleton.html',
})
export class CountriesSkeleton {
  rows = Array(10);
}
