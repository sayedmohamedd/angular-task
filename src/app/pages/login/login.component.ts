import { Component } from '@angular/core';
import { Auth } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { FormError } from '../../components/shared/form-error/form-error';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, FormError],
  templateUrl: './login.component.html',
})
export class Login {
  formData: FormGroup;
  submitted = false;

  constructor(
    private _authService: Auth,
    private _formBuilder: FormBuilder,
    private router: Router,
  ) {
    this.formData = this._formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login() {
    this.submitted = true;

    if (this.formData.invalid) {
      this.username?.markAsTouched();
      this.password?.markAsTouched();
      return;
    }

    const { username, password } = this.formData.value;

    if (username === 'admin' && password === 'admin') {
      this._authService.setToken('token');
      this.router.navigate(['dashboard']);
    } else {
      this.username?.setErrors({ invalid: true });
      this.password?.setErrors({ invalid: true });
    }
  }

  // Getters
  get username() {
    return this.formData.get('username');
  }

  get password() {
    return this.formData.get('password');
  }
}
