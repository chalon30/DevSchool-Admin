// src/app/pages/progreso-admin/progreso-admin.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ProgresoService } from '../../core/services/progreso.service';
import { ProgresoCursoDTO } from '../../core/models/progreso.model';
import { UsuarioService } from '../../core/services/usuario.service';
import { Usuario } from '../../core/models/usuario.model';

@Component({
  selector: 'app-progreso-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './progreso-admin.html',
  styleUrls: ['./progreso-admin.css'],
})
export class ProgresoAdmin implements OnInit {
  private progresoService = inject(ProgresoService);
  private usuarioService = inject(UsuarioService);

  // usuarios
  usuarios: Usuario[] = [];
  filtroTexto: string = '';

  // progreso
  usuarioIdInput: number | null = null;
  cargando = false;
  error: string | null = null;
  progresos: ProgresoCursoDTO[] = [];

  ngOnInit(): void {
    // cargamos todos los usuarios una sola vez
    this.usuarioService.listar().subscribe({
      next: (data) => {
        this.usuarios = data;
      },
      error: (err) => {
        console.error('Error al cargar usuarios para filtro de progreso:', err);
      },
    });
  }

  // getter para filtrar por nombre/apellidos/correo
  get usuariosFiltrados(): Usuario[] {
    const t = this.filtroTexto.trim().toLowerCase();
    if (!t) return this.usuarios;

    return this.usuarios.filter((u) => {
      const full = `${u.nombre ?? ''} ${u.apellidos ?? ''} ${u.correo ?? ''}`.toLowerCase();
      return full.includes(t);
    });
  }

  // buscar progreso por ID (lo usamos internamente y sigue sirviendo si quieres meter ID directo)
  buscar() {
    this.error = null;
    this.progresos = [];

    if (!this.usuarioIdInput) {
      this.error = 'Selecciona un usuario o ingresa un ID válido.';
      return;
    }

    this.cargando = true;
    this.progresoService.obtenerProgresoPorUsuario(this.usuarioIdInput).subscribe({
      next: (data) => {
        this.progresos = data;
        this.cargando = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'No se pudo obtener el progreso del usuario.';
        this.cargando = false;
      },
    });
  }

  // cuando haces clic en un usuario de la lista
  verProgreso(usuario: Usuario) {
    if (!usuario.id) return;
    this.usuarioIdInput = usuario.id;
    this.buscar();
  }
}
