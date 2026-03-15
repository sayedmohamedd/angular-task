import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  constructor() {}
  router = inject(Router)

  users = [
    {
      username: 'admin',
      password: 'admin',
    },
  ]

  getToken() {
    return localStorage.getItem('token');
  }

  setToken(token: string) {
    localStorage.setItem('token', token);
  }

  removeToken() {
    localStorage.removeItem('token');
  }

  logout() {
    this.removeToken();
    this.router.navigate(['login']);
  }

}
