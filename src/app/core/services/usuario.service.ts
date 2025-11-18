import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { appsettings } from '../../Settings/appsettings';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private http = inject(HttpClient);
  private apiUrl = `${appsettings.apiUrl}usuarios`;

  /** Listar todos los usuarios */
  listar(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  /** Obtener usuario por id */
  obtenerPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  /** Activar usuario por id */
  activarUsuario(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/activar/${id}`, {});
  }

  /** Eliminar usuario */
  eliminarUsuario(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  cambiarContrasena(id: number, nueva: string, confirmar: string) {
    return this.http.put(`${this.apiUrl}/cambiar-contrasena/${id}`, {
      nueva,
      confirmar,
    });
  }
}
