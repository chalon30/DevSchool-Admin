import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { appsettings } from '../../Settings/appsettings';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private http = inject(HttpClient);
  private apiUrl = `${appsettings.apiUrl}usuarios`;

  // Subject para emitir la lista de usuarios
  private usuariosSubject = new BehaviorSubject<Usuario[]>([]);
  usuarios$ = this.usuariosSubject.asObservable();

  /** Listar todos los usuarios y emitirlos */
  listar(): Observable<Usuario[]> {
    return this.http
      .get<Usuario[]>(this.apiUrl)
      .pipe(tap((data) => this.usuariosSubject.next(data)));
  }

  /** Obtener usuario por id */
  obtenerPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  /** Activar usuario por id y recargar lista */
  activarUsuario(id: number): Observable<void> {
    return this.http
      .put<void>(`${this.apiUrl}/activar/${id}`, {})
      .pipe(tap(() => this.listar().subscribe()));
  }

  /** Eliminar usuario y recargar lista */
  eliminarUsuario(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`)
      .pipe(tap(() => this.listar().subscribe()));
  }

  /** Cambiar contraseña y recargar lista */
  cambiarContrasena(id: number, nueva: string, confirmar: string) {
    return this.http
      .put(`${this.apiUrl}/cambiar-contrasena/${id}`, { nueva, confirmar })
      .pipe(tap(() => this.listar().subscribe()));
  }

  /** Listar pendientes */
  listarPendientes(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.apiUrl}/pendientes`);
  }

  cambiarRol(id: number, rol: string) {
    return this.http.put<{ rol: string; mensaje: string }>(`${this.apiUrl}/${id}/rol`, { rol });
  }
}
