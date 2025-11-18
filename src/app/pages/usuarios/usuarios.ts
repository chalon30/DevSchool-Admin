import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioService } from '../../core/services/usuario.service';
import { Usuario } from '../../core/models/usuario.model';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatInputModule
  ],
  templateUrl: './usuarios.html',
  styleUrls: ['./usuarios.css'],
})
export class Usuarios implements OnInit {
  private usuarioService = inject(UsuarioService);

  usuarios: Usuario[] = [];
  cargando: boolean = false;

  displayedColumns: string[] = ['id', 'nombre', 'apellidos', 'correo', 'rol', 'activo', 'acciones'];

  // Variables para cambiar contraseña
  mostrarCambioId: number | null = null;
  nueva: string = '';
  confirmar: string = '';

  ngOnInit(): void {
    this.listarUsuarios();
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

  activarUsuario(usuario: Usuario): void {
    if (!usuario.id) return;

    this.usuarioService.activarUsuario(usuario.id).subscribe({
      next: () => usuario.activo = true,
      error: (err) => console.error('Error al activar usuario:', err),
    });
  }

  abrirCambioContrasena(usuario: Usuario) {
    this.mostrarCambioId = usuario.id!;
    this.nueva = '';
    this.confirmar = '';
  }

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
        error: (err) => console.error(err)
      });
  }

  cancelarCambio() {
    this.mostrarCambioId = null;
  }
}
