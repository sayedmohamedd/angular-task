import { Component } from '@angular/core';
import { Auth } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FormError } from '../../components/shared/form-error/form-error';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormError, NgClass],
  templateUrl: './login.component.html',
})
export class Login {
  formData: FormGroup;
  isLoading = false;

  constructor(
    private _authService: Auth,
    private _formBuilder: FormBuilder,
    private _router: Router,
  ) {
    this.formData = this._formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login() {
    if (this.formData.invalid) {
      this.formData.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const { username, password } = this.formData.value;

    // Demo logic (replace with real API)
    setTimeout(() => {
      if (username === 'admin' && password === 'admin') {
        this._authService.setToken('token');
        this._router.navigate(['dashboard']);
      } else {
        this.formData.setErrors({ invalidCredentials: true });
      }

      this.isLoading = false;
    }, 800);
  }

  // Getters
  get username() {
    return this.formData.get('username');
  }

  get password() {
    return this.formData.get('password');
  }
}
