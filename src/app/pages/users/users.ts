import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UsuarioService } from '../../core/services/usuario.service';
import { Usuario } from '../../core/models/usuario.model';

@Component({
  selector: 'app-users',
  standalone: true,
  templateUrl: './users.html',
  styleUrls: ['./users.css'],
  imports: [CommonModule, FormsModule],
})
export class User implements OnInit {
  private usuarioService = inject(UsuarioService);

  usuarios: Usuario[] = [];
  cargando = false;

  // Cambio de contraseña
  mostrarCambioId: number | null = null;
  nueva = '';
  confirmar = '';

  // UX: Indicador de acción en proceso
  accionEnProceso?: number | null = null;

  // 👉 info del usuario logueado
  currentUserId: number | null = null;
  currentUserRol: string | null = null;

  ngOnInit(): void {
    // Leer del localStorage (login admin/profesor)
    const id = localStorage.getItem('admin_id');
    const rol = localStorage.getItem('admin_rol');

    this.currentUserId = id ? Number(id) : null;
    this.currentUserRol = rol ? rol.toUpperCase() : null;

    this.cargando = true;

    this.usuarioService.usuarios$.subscribe({
      next: (data) => {
        this.usuarios = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.cargando = false;
      },
    });

    // Cargar la primera vez
    this.usuarioService.listar().subscribe();
  }

  // 🔒 Saber si un usuario es admin (por rol o flag esAdmin)
  esAdmin(u: Usuario): boolean {
    const rol = (u.rol ?? '').toUpperCase();
    const flag = (u as any).esAdmin === true;
    return rol === 'ADMIN' || flag;
  }

  /**
   * ✅ Regla nueva:
   * - PROFESOR y ADMIN pueden cambiar contraseñas
   * - PERO nunca de un usuario ADMIN
   */
  puedeCambiarPassword(usuario: Usuario): boolean {
    // Si el target es ADMIN → prohibido
    if (this.esAdmin(usuario)) return false;

    const rolActual = (this.currentUserRol ?? '').toUpperCase();
    return rolActual === 'ADMIN' || rolActual === 'PROFESOR';
  }

  activarUsuario(usuario: Usuario) {
    if (!usuario.id) return;
    if (!confirm(`¿Desea activar al usuario ${usuario.nombre} ${usuario.apellidos}?`)) return;

    this.accionEnProceso = usuario.id;
    this.usuarioService.activarUsuario(usuario.id).subscribe({
      next: () => {
        this.accionEnProceso = null;
        this.listarUsuarios();
      },
      error: (err) => {
        console.error('Error al activar usuario:', err);
        this.accionEnProceso = null;
      },
    });
  }

  eliminarUsuario(usuario: Usuario) {
    if (!usuario.id) return;

    // 🚫 No permitir eliminar ADMIN
    if (this.esAdmin(usuario)) {
      alert('El usuario ADMIN no se puede eliminar.');
      return;
    }

    if (!confirm(`¿Eliminar al usuario ${usuario.nombre} ${usuario.apellidos}?`)) return;

    this.accionEnProceso = usuario.id;
    this.usuarioService.eliminarUsuario(usuario.id).subscribe({
      next: () => {
        this.accionEnProceso = null;
        this.listarUsuarios();
      },
      error: (err) => {
        console.error('Error al eliminar usuario:', err);
        this.accionEnProceso = null;
      },
    });
  }

  abrirCambioContrasena(usuario: Usuario) {
    // ✅ Profes/admin pueden cambiar, excepto admins
    if (!this.puedeCambiarPassword(usuario)) {
      alert('No tienes permiso para cambiar la contraseña de este usuario.');
      return;
    }

    this.mostrarCambioId = usuario.id!;
    this.nueva = '';
    this.confirmar = '';
  }

  cambiarContrasena(usuario: Usuario) {
    // Seguridad extra
    if (!this.puedeCambiarPassword(usuario)) {
      alert('No tienes permiso para cambiar la contraseña de este usuario.');
      return;
    }

    if (!this.nueva || !this.confirmar) {
      alert('Todos los campos son obligatorios');
      return;
    }

    if (this.nueva.length < 6) {
      alert('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (this.nueva !== this.confirmar) {
      alert('Las contraseñas no coinciden');
      return;
    }

    this.accionEnProceso = usuario.id;
    this.usuarioService.cambiarContrasena(usuario.id!, this.nueva, this.confirmar).subscribe({
      next: () => {
        alert('Contraseña actualizada correctamente');
        this.mostrarCambioId = null;
        this.nueva = '';
        this.confirmar = '';
        this.listarUsuarios();
        this.accionEnProceso = null;
      },
      error: (err) => {
        console.error('Error al cambiar contraseña:', err);
        this.accionEnProceso = null;
      },
    });
  }

  cancelarCambio() {
    this.mostrarCambioId = null;
    this.nueva = '';
    this.confirmar = '';
  }

  isAccionEnProceso(usuario: Usuario): boolean {
    return this.accionEnProceso === usuario.id;
  }

  listarUsuarios(): void {
    this.cargando = true;
    this.usuarioService.listar().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        this.cargando = false;
      },
    });
  }
}
