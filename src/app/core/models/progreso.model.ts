// src/app/core/models/progreso-curso.model.ts
export interface ProgresoCursoDTO {
  cursoId: number;
  usuarioId: number;
  porcentaje: number;
  leccionesCompletadas: number;
  totalLecciones: number;
  ultimaLeccionId: number | null;
  ultimaLeccionTitulo: string | null;
  cursoCompletado: boolean;
  leccionesCompletadasIds: number[];
}
