// src/app/pages/login/login.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
})
export class LoginPage {
  private authService = inject(AuthService);
  private router = inject(Router);

  correo = '';
  password = '';
  cargando = false;
  error: string | null = null;

  login() {
    this.error = null;

    if (!this.correo || !this.password) {
      this.error = 'Ingresa tu correo y contraseña.';
      return;
    }

    this.cargando = true;

    this.authService.loginAdmin(this.correo, this.password).subscribe({
      next: (resp) => {
        this.cargando = false;

        // 🧠 Guardar datos del usuario admin/profesor
        // resp viene del backend: { token, id, nombre, apellidos, correo, rol, esAdmin }
        localStorage.setItem('admin_token', resp.token);
        localStorage.setItem('admin_id', String(resp.id));
        localStorage.setItem('admin_rol', resp.rol ?? '');
        localStorage.setItem('admin_nombre', resp.nombre ?? '');
        localStorage.setItem('admin_correo', resp.correo ?? '');

        // Ir al home del panel
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error(err);
        this.cargando = false;
        this.error =
          err.error?.error ||
          'No se pudo iniciar sesión. Verifica tus credenciales.';
      },
    });
  }
}
