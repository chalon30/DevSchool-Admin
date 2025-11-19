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
        // Si llegó aquí, es ADMIN o PROFESOR
        this.router.navigate(['/home']); // o donde empiece tu panel
      },
      error: (err) => {
        console.error(err);
        this.cargando = false;
        // Mostramos mensaje del backend si viene
        this.error =
          err.error?.error ||
          'No se pudo iniciar sesión. Verifica tus credenciales.';
      },
    });
  }
}
