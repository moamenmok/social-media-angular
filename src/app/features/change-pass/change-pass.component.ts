import { Component, inject, signal, WritableSignal } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { UserInfoService } from '../../core/auth/services/user-info.service';

@Component({
  selector: 'app-change-pass',
  imports: [ReactiveFormsModule],
  templateUrl: './change-pass.component.html',
  styleUrl: './change-pass.component.css',
})
export class ChangePassComponent {
  private readonly userInfo = inject(UserInfoService);

  changePasswordForm = new FormGroup(
    {
      currentPassword: new FormControl('', [Validators.required]),
      newPassword: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/),
      ]),
      rePassword: new FormControl('', [Validators.required]),
    },
    { validators: this.confirmPassword },
  );

  errorMessage: WritableSignal<string> = signal('');
  successMessage: WritableSignal<string> = signal('');
  isloading = signal(false);

  visible = signal({ currentPassword: false, newPassword: false, rePassword: false });

  toggleVisibility(field: 'currentPassword' | 'newPassword' | 'rePassword'): void {
    this.visible.update((v) => ({ ...v, [field]: !v[field] }));
  }

  get currentPassword() {
    return this.changePasswordForm.controls.currentPassword;
  }
  get newPassword() {
    return this.changePasswordForm.controls.newPassword;
  }
  get rePassword() {
    return this.changePasswordForm.controls.rePassword;
  }

  onSubmit(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (this.changePasswordForm.valid) {
      this.isloading.set(true);

      const body = {
        password: this.currentPassword.value!,
        newPassword: this.newPassword.value!,
      };

      this.userInfo.userChangePassword(body).subscribe({
        next: (respone) => {
          if (respone.success) {
            this.successMessage.set(respone.message);
            this.changePasswordForm.reset();
            this.loggedout();
          }
        },
        error: (err) => {
          console.log(err.error.message);
          this.errorMessage.set(err.error.message);
          this.isloading.set(false);
        },
        complete: () => {
          this.isloading.set(false);
        },
      });
    } else {
      this.changePasswordForm.markAllAsTouched();
    }
  }

  confirmPassword(form: AbstractControl): ValidationErrors | null {
    const password = form.get('newPassword')?.value;
    const rePassword = form.get('rePassword')?.value;
    const reControl = form.get('rePassword');

    if (password !== rePassword) {
      reControl?.setErrors({ mismatch: true });
      return { mismatch: true };
    }

    if (reControl?.hasError('mismatch')) {
      const { mismatch, ...rest } = reControl.errors ?? {};
      reControl.setErrors(Object.keys(rest).length ? rest : null);
    }
    return null;
  }
  loggedout() {
    this.userInfo.loggedOut();
  }
}
