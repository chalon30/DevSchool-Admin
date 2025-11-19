// src/app/core/guards/auth.guard.ts
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | UrlTree {
    const token = localStorage.getItem('admin_token');
    const rol = localStorage.getItem('admin_rol');

    // ❌ Si no hay token o rol → mandar al login
    if (!token || !rol) {
      return this.router.parseUrl('/login');
    }

    // ❌ Si no es ADMIN ni PROFESOR → mandar al login
    if (rol !== 'ADMIN' && rol !== 'PROFESOR') {
      return this.router.parseUrl('/login');
    }

    // ✅ Tiene token y rol válido → puede pasar
    return true;
  }
}
