import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsuarioService } from '../../core/services/usuario.service';
import { Usuario } from '../../core/models/usuario.model';

/* Angular Material */
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users',
  standalone: true,
  templateUrl: './users.html',
  styleUrls: ['./users.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    MatFormFieldModule
  ],
})
export class User implements OnInit {

  private usuarioService = inject(UsuarioService);

  usuarios: Usuario[] = [];
  cargando: boolean = false;

  displayedColumns: string[] = [
    'id',
    'nombre',
    'apellidos',
    'correo',
    'rol',
    'activo',
    'acciones'
  ];

  // Cambio de contraseña
  mostrarCambioId: number | null = null;
  nueva: string = '';
  confirmar: string = '';

  // UX: Indicador de acción en proceso
  accionEnProceso?: number | null = null;

  ngOnInit(): void {
    this.cargando = true;

    // Nos suscribimos al BehaviorSubject del servicio para recibir automáticamente cambios
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

  /** Activar usuario */
  activarUsuario(usuario: Usuario) {
    if (!usuario.id) return;
    if (!confirm(`¿Desea activar al usuario ${usuario.nombre} ${usuario.apellidos}?`)) return;

    this.accionEnProceso = usuario.id;
    this.usuarioService.activarUsuario(usuario.id).subscribe({
      next: () => {
        this.accionEnProceso = null;
        this.listarUsuarios(); // recargar tabla
      },
      error: (err) => {
        console.error('Error al activar usuario:', err);
        this.accionEnProceso = null;
      },
    });
  }

  /** Eliminar usuario */
  eliminarUsuario(usuario: Usuario) {
    if (!usuario.id) return;
    if (!confirm(`¿Eliminar al usuario ${usuario.nombre} ${usuario.apellidos}?`)) return;

    this.accionEnProceso = usuario.id;
    this.usuarioService.eliminarUsuario(usuario.id).subscribe({
      next: () => {
        this.accionEnProceso = null;
        this.listarUsuarios(); // recargar tabla
      },
      error: (err) => {
        console.error('Error al eliminar usuario:', err);
        this.accionEnProceso = null;
      },
    });
  }

  /** Mostrar formulario cambiar contraseña */
  abrirCambioContrasena(usuario: Usuario) {
    this.mostrarCambioId = usuario.id!;
    this.nueva = '';
    this.confirmar = '';
  }

  /** Cambiar contraseña */
  cambiarContrasena(usuario: Usuario) {
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
        // Reiniciar el formulario y recargar la tabla
        this.mostrarCambioId = null;
        this.nueva = '';
        this.confirmar = '';
        this.listarUsuarios(); // aseguramos que la tabla se actualice
        this.accionEnProceso = null;
      },
      error: (err) => {
        console.error('Error al cambiar contraseña:', err);
        this.accionEnProceso = null;
      },
    });
  }

  /** Cancelar cambio de contraseña */
  cancelarCambio() {
    this.mostrarCambioId = null;
    this.nueva = '';
    this.confirmar = '';
  }

  /** Verificar si hay acción en proceso para un usuario */
  isAccionEnProceso(usuario: Usuario): boolean {
    return this.accionEnProceso === usuario.id;
  }

  /** Refrescar usuarios manualmente */
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
