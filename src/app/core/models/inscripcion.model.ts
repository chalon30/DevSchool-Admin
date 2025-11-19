// src/app/core/models/inscripcion.model.ts
export interface InscripcionCursoDTO {
  id: number;
  usuarioId: number;
  cursoId: number;
  estado: string;
  fechaInscripcion: string;
  fechaCompletado?: string | null;
}
