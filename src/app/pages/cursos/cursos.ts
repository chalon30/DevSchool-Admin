// src/app/pages/cursos/cursos.ts
import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CursoService } from '../../core/services/curso.service';
import { InscripcionService } from '../../core/services/inscripcion.service';
import { CursoDTO } from '../../core/models/curso.model';

@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cursos.html',
  styleUrls: ['./cursos.css'],
})
export class Cursos implements OnInit {
  private cursoService = inject(CursoService);
  private inscripcionService = inject(InscripcionService);

  cargando = false;
  cursos: CursoDTO[] = [];
  // cursoId -> lista de usuarios inscritos
  inscritosPorCurso: Record<number, any[]> = {};

  ngOnInit(): void {
    this.cargando = true;

    this.cursoService.listarCursos().subscribe({
      next: (cursos) => {
        this.cursos = cursos;

        cursos.forEach((curso) => {
          this.inscripcionService
            .getInscripcionesPorCurso(curso.id)
            .subscribe({
              next: (inscripciones) => {
                this.inscritosPorCurso[curso.id] = inscripciones;
              },
              error: (err) =>
                console.error(
                  `Error al cargar inscritos del curso ${curso.id}:`,
                  err
                ),
            });
        });

        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar cursos:', err);
        this.cargando = false;
      },
    });
  }
}
