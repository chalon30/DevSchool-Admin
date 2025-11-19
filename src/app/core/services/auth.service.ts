// src/app/core/services/auth.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { appsettings } from '../../Settings/appsettings';

export interface LoginResponse {
  token: string;
  id: number;
  nombre: string;
  apellidos: string;
  correo: string;
  rol: string;
  esAdmin: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${appsettings.apiUrl}auth`; // http://localhost:8080/api/auth

  // 🔐 Login general (por si lo necesitas para otra cosa)
  login(correo: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, {
      correo,
      password,
    });
  }

  // 🔐 Login SOLO para panel admin (ADMIN / PROFESOR)
  loginAdmin(correo: string, password: string): Observable<LoginResponse> {
    return this.http
      .post<LoginResponse>(`${this.apiUrl}/admin-login`, {
        correo,
        password,
      })
      .pipe(
        tap((resp) => {
          // Aquí puedes guardar token y datos en localStorage si quieres
          localStorage.setItem('admin_token', resp.token);
          localStorage.setItem('admin_rol', resp.rol);
          localStorage.setItem(
            'admin_nombre',
            `${resp.nombre} ${resp.apellidos}`
          );
        })
      );
  }

  logoutAdmin() {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_rol');
    localStorage.removeItem('admin_nombre');
  }

  get adminToken(): string | null {
    return localStorage.getItem('admin_token');
  }

  get adminRol(): string | null {
    return localStorage.getItem('admin_rol');
  }
}
