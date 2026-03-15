import { Component } from '@angular/core';
import { CountriesTable } from "../../components/countries-table/countries-table";

@Component({
  selector: 'app-dashboard',
  imports: [CountriesTable],
  templateUrl: './dashboard.component.html',
})
export class Dashboard {}
