// src/app/pages/home/home.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
})
export class HomePage {
  get nombre(): string {
    return localStorage.getItem('admin_nombre') ?? 'Administrador';
  }

  get rol(): string {
    return localStorage.getItem('admin_rol') ?? '';
  }
}
