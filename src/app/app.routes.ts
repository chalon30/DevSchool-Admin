import { Routes } from '@angular/router';
import { User } from './pages/users/users';
import { Cursos } from './pages/cursos/cursos';
import { ProgresoAdmin } from './pages/progreso-admin/progreso-admin';


export const routes: Routes = [
  { path: '', redirectTo: 'users', pathMatch: 'full' },
  { path: 'users', component: User },
  { path: 'cursos', component: Cursos },
  { path: 'progreso-admin', component: ProgresoAdmin },
  { path: '**', redirectTo: 'users' },
];
