import { Routes } from '@angular/router';
import { User } from './pages/users/users';
import { Cursos } from './pages/cursos/cursos';
import { ProgresoAdmin } from './pages/progreso-admin/progreso-admin';
import { Configuracion } from './pages/configuracion/configuracion';
import { LoginPage } from './pages/login/login';
import { HomePage } from './pages/home/home';
import { AuthGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  // Home real → login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Login público
  { path: 'login', component: LoginPage },

  // Home del panel (protegido)
  { path: 'home', component: HomePage, canActivate: [AuthGuard] },

  // Rutas protegidas
  { path: 'users', component: User, canActivate: [AuthGuard] },
  { path: 'cursos', component: Cursos, canActivate: [AuthGuard] },
  { path: 'progreso-admin', component: ProgresoAdmin, canActivate: [AuthGuard] },
  { path: 'configuracion', component: Configuracion, canActivate: [AuthGuard] },

  // Cualquier otra → login
  { path: '**', redirectTo: 'login' },
];
