import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { minLength, pattern, required } from '@angular/forms/signals';
import { initFlowbite } from 'flowbite';
import { AuthService } from '../../core/auth/services/auth/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  registerForm = new FormGroup(
    {
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
      ]),
      username: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email]),
      dateOfBirth: new FormControl('', [Validators.required]),
      gender: new FormControl('', [Validators.required]),
      password: new FormControl('', [
        Validators.required,
        Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
      ]),
      rePassword: new FormControl('', [Validators.required]),
    },
    { validators: this.confirmPassword },
  );

  registerErrorMessage: WritableSignal<string> = signal('');
  registerSuccessMessage: WritableSignal<string> = signal('');
  iserror = signal(false);
  isloading = signal(false);
  submitform() {
    this.registerErrorMessage.set('');
    this.registerSuccessMessage.set('');

    if (this.registerForm.valid) {
      this.isloading.set(true);

      this.authService.register(this.registerForm.value).subscribe({
        next: (respone) => {
          if (respone.success) {
            this.registerSuccessMessage.set(respone.message);

            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 1500);
          }
        },
        error: (err) => {
          console.log(err.error.message);
          this.iserror.set(true);
          this.registerErrorMessage.set(err.error.message);
          this.isloading.set(false);
        },
        complete: () => {
          this.isloading.set(false);
        },
      });
      console.log(this.registerForm);
    } else {
      this.registerForm.markAllAsDirty();
    }
  }
  confirmPassword(form: AbstractControl): ValidationErrors | null {
    const password = form.get('password')?.value;
    const rePassword = form.get('rePassword')?.value;

    if (password !== rePassword) {
      form.get('rePassword')?.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    return null;
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
