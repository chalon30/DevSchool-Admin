// src/app/core/services/progreso.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProgresoCursoDTO } from '../models/progreso.model';
import { appsettings } from '../../Settings/appsettings'; // ajusta la ruta si es distinta

@Injectable({
  providedIn: 'root',
})
export class ProgresoService {
  private http = inject(HttpClient);
  private baseUrl = `${appsettings.apiUrl}progreso`;

  // GET /api/progreso/usuario/{usuarioId}
  obtenerProgresoPorUsuario(usuarioId: number): Observable<ProgresoCursoDTO[]> {
    return this.http.get<ProgresoCursoDTO[]>(`${this.baseUrl}/usuario/${usuarioId}`);
  }

  // GET /api/progreso/{cursoId}?usuarioId=
  obtenerProgresoCurso(usuarioId: number, cursoId: number): Observable<ProgresoCursoDTO> {
    return this.http.get<ProgresoCursoDTO>(
      `${this.baseUrl}/${cursoId}`,
      { params: { usuarioId: usuarioId.toString() } }
    );
  }
}
