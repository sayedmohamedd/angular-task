import { Component, Input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Country } from '../../models/country.model';
import { BaseChartDirective } from 'ng2-charts';
import {
  Chart,
  ChartConfiguration,
  ChartOptions,
  CategoryScale,
  LinearScale,
  BarElement,
  BarController,
  Tooltip,
  Legend,
} from 'chart.js';

Chart.register(CategoryScale, LinearScale, BarElement, BarController, Tooltip, Legend);

@Component({
  selector: 'app-countries-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './countries-chart.component.html',
})
export class CountriesChartComponent {
  @Input() countries: Country[] = [];

  // مثال: عدد الدول في كل قارة
  readonly chartData = computed<ChartConfiguration<'bar'>['data']>(() => {
    const counts: Record<string, number> = {};

    for (const c of this.countries || []) {
      const continent = c.continents?.[0] || 'Unknown';
      counts[continent] = (counts[continent] || 0) + 1;
    }

    const labels = Object.keys(counts);
    const data = Object.values(counts);

    return {
      labels,
      datasets: [
        {
          data,
          label: 'Countries per region',
          backgroundColor: 'rgba(37, 99, 235, 0.6)',
          borderColor: 'rgba(37, 99, 235, 1)',
          borderWidth: 1,
        },
      ],
    };
  });

  readonly chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        enabled: true,
      },
    },
    scales: {
      x: {
        ticks: {
          maxRotation: 60,
          minRotation: 0,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };
}

