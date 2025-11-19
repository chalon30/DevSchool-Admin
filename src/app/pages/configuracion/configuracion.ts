import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UsuarioService } from '../../core/services/usuario.service';
import { Usuario } from '../../core/models/usuario.model';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './configuracion.html',
})
export class Configuracion implements OnInit {
  private usuarioService = inject(UsuarioService);

  usuarios: Usuario[] = [];
  cargando = false;
  guardandoId: number | null = null;
  error: string | null = null;
  filtro = '';

  // 🔒 Solo estos roles se pueden cambiar
  rolesDisponibles: string[] = ['ALUMNO', 'PROFESOR'];

  ngOnInit(): void {
    this.cargarUsuarios();
  }

  get usuariosFiltrados(): Usuario[] {
    const t = this.filtro.trim().toLowerCase();
    if (!t) return this.usuarios;

    return this.usuarios.filter((u) => {
      const full = `${u.nombre ?? ''} ${u.apellidos ?? ''} ${u.correo ?? ''}`.toLowerCase();
      return full.includes(t);
    });
  }

  cargarUsuarios(): void {
    this.cargando = true;
    this.error = null;

    this.usuarioService.listar().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'No se pudieron cargar los usuarios.';
        this.cargando = false;
      },
    });
  }

  cambiarRol(usuario: Usuario, nuevoRol: string) {
    if (!usuario.id) return;

    const rolActual = (usuario.rol ?? '').toUpperCase();
    const rolDestino = (nuevoRol ?? '').toUpperCase();

    // 🔒 No tocar admins
    if (rolActual === 'ADMIN') {
      this.error = 'El rol ADMIN no se puede modificar desde esta pantalla.';
      return;
    }

    // 🔒 Solo ALUMNO / PROFESOR
    if (rolDestino !== 'ALUMNO' && rolDestino !== 'PROFESOR') {
      this.error = 'Solo se permite cambiar entre ALUMNO y PROFESOR.';
      return;
    }

    // Nada que hacer si es el mismo rol
    if (rolActual === rolDestino) {
      return;
    }

    this.guardandoId = usuario.id;
    this.error = null;

    this.usuarioService.cambiarRol(usuario.id, rolDestino).subscribe({
      next: (resp) => {
        // Actualizamos el rol en la tabla con lo que devuelve el backend
        usuario.rol = resp.rol;
        this.guardandoId = null;
      },
      error: (err) => {
        console.error('Error en cambiarRol:', err);
        // 🔍 Mostrar mensaje real del backend si viene en .mensaje
        this.error = err.error?.mensaje || err.error || 'No se pudo actualizar el rol.';
        this.guardandoId = null;
      },
    });
  }
}
