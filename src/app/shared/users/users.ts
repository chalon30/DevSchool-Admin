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

  /* IMPORTS STANDALONE */
  imports: [
    CommonModule,
    FormsModule,

    /* Angular Material */
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

  ngOnInit(): void {
    this.listarUsuarios();
  }

  /** Cargar usuarios */
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

  /** Activar usuario */
  activarUsuario(usuario: Usuario) {
    if (!usuario.id) return;

    this.usuarioService.activarUsuario(usuario.id).subscribe({
      next: () => usuario.activo = true,
      error: (err) => console.error('Error al activar usuario:', err),
    });
  }

  /** Eliminar usuario */
  eliminarUsuario(usuario: Usuario) {
    if (!usuario.id) return;

    if (!confirm(`¿Eliminar usuario ${usuario.nombre}?`)) return;

    this.usuarioService.eliminarUsuario(usuario.id).subscribe({
      next: () => {
        this.usuarios = this.usuarios.filter(u => u.id !== usuario.id);
      },
      error: (err) => console.error('Error al eliminar usuario:', err),
    });
  }

  /** Mostrar formulario cambiar contraseña */
  abrirCambioContrasena(usuario: Usuario) {
    this.mostrarCambioId = usuario.id!;
    this.nueva = '';
    this.confirmar = '';
  }

  /** Confirmar cambio de contraseña */
  cambiarContrasena(usuario: Usuario) {
    if (this.nueva !== this.confirmar) {
      alert('Las contraseñas no coinciden');
      return;
    }

    this.usuarioService.cambiarContrasena(usuario.id!, this.nueva, this.confirmar)
      .subscribe({
        next: () => {
          alert('Contraseña actualizada correctamente');
          this.mostrarCambioId = null;
        },
        error: (err) => console.error('Error al cambiar contraseña:', err),
      });
  }

  cancelarCambio() {
    this.mostrarCambioId = null;
  }
}
