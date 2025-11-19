// src/app/core/services/inscripcion.service.ts
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { appsettings } from '../../Settings/appsettings';
import { Observable } from 'rxjs';
import { InscripcionCursoDTO } from '../models/inscripcion.model';

@Injectable({
  providedIn: 'root',
})
export class InscripcionService {
  private http = inject(HttpClient);
  private apiUrl = `${appsettings.apiUrl}inscripciones`;

  // Obtener todos los usuarios inscritos de un curso
  getInscripcionesPorCurso(cursoId: number): Observable<InscripcionCursoDTO[]> {
    return this.http.get<InscripcionCursoDTO[]>(`${this.apiUrl}/curso/${cursoId}`);
  }

  // Inscribirse en un curso
  inscribirme(usuarioId: number, cursoId: number): Observable<InscripcionCursoDTO> {
    return this.http.post<InscripcionCursoDTO>(`${this.apiUrl}/${cursoId}/inscribirme`, { usuarioId });
  }

  // Obtener inscripciones de un usuario
  getInscripcionesPorUsuario(usuarioId: number): Observable<InscripcionCursoDTO[]> {
    return this.http.get<InscripcionCursoDTO[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }
}
