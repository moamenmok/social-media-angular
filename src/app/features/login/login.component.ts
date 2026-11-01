import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ɵInternalFormsSharedModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { email } from '@angular/forms/signals';
import { AuthService } from '../../core/auth/services/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ɵInternalFormsSharedModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });
  loginErrorMessage: WritableSignal<string> = signal('');
  loginSuccessMessage: WritableSignal<string> = signal('');
  iserror = signal(false);
  isloading = signal(false);
  submitform() {
    this.loginErrorMessage.set('');
    this.loginSuccessMessage.set('');

    if (this.loginForm.valid) {
      this.isloading.set(true);

      this.authService.login(this.loginForm.value).subscribe({
        next: (respone) => {
          if (respone.success) {
            localStorage.setItem('socialToken', respone.data.token);
            localStorage.setItem('socialUser', JSON.stringify(respone.data.user));
            this.loginSuccessMessage.set(respone.message);

            setTimeout(() => {
              this.router.navigate(['/home']);
            }, 1500);
          }
        },
        error: (err) => {
          this.iserror.set(true);
          this.loginErrorMessage.set(err.error.message);
          this.isloading.set(false);
        },
        complete: () => {
          this.isloading.set(false);
        },
      });
    } else {
      this.loginForm.markAllAsDirty();
    }
  }
  togglePassword(passwordElement: HTMLInputElement): void {
    if (passwordElement.type === 'password') {
      passwordElement.type = 'text';
    } else {
      passwordElement.type = 'password';
    }
  }

  ngOnInit(): void {
    initFlowbite();
  }
}
