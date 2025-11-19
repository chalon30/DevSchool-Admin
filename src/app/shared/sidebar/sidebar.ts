import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
  ],
  templateUrl: './sidebar.html',
})
export class Sidebar {
  // Arranca cerrado
  isOpen = false;

  constructor(private router: Router) {}

  /** Solo mostramos el sidebar si hay token y rol válidos */
  get isLoggedIn(): boolean {
    const token = localStorage.getItem('admin_token');
    const rol = localStorage.getItem('admin_rol');
    return !!token && !!rol;
  }

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }

  /** Cerrar sesión */
  logout() {
    // Limpia todo lo que guardaste al hacer login
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_rol');
    localStorage.removeItem('admin_nombre');

    this.isOpen = false;

    // Redirige al login
    this.router.navigate(['/login']);
  }
}
