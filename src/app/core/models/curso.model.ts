// src/app/core/models/curso.model.ts
export interface ModuloDTO {
  id: number;
  titulo: string;
  descripcion?: string;
  lecciones?: any[]; // opcional, dependiendo de tu modelo de lección
}

export interface CursoDTO {
  id: number;
  titulo: string;
  descripcion?: string;
  imagenUrl?: string;
  modulos?: ModuloDTO[];
}
