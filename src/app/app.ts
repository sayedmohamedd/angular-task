import { Component, signal } from '@angular/core';
import { CountriesTable } from "./components/countries-table/countries-table";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [ RouterOutlet]
})
export class App {
  protected readonly title = signal('angular-task');
}
