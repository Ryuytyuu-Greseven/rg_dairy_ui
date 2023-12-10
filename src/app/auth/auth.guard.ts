import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard = () => {
  const router = inject(Router);

  console.log('authGuard#canActivate called');
  if (sessionStorage.getItem('locator') && sessionStorage.getItem('username')) {
    return true;
  } else {
    return router.parseUrl('/login');
  }
};
