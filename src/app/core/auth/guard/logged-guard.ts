import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const loggedGuard: CanActivateFn = () => {
  let router = inject(Router);
  if (localStorage.getItem('socialToken')) {
    return router.parseUrl('/home');
  } else {
    return true;
  }
};
