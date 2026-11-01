import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  let spinner = inject(NgxSpinnerService);

  if (req.url.includes('/signup') || req.url.includes('/signin')) {
    spinner.show();
  }
  return next(req).pipe(
    finalize(() => {
      spinner.hide();
    }),
  );
};
