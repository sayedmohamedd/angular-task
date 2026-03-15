import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { guestGuard } from './core/guards/guest.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then((c) => c.Dashboard),
    canActivate: [authGuard],
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then((c) => c.Login),
    canActivate:[guestGuard]
  },
  {
    path:'**',
    loadComponent: () => import('./pages/not-found/not-found.component.ts').then((c) => c.NotFoundComponentTs),
  }
];
