import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';    // ⬅️ AÑADIR ESTO
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,   // ⬅️ Y ESTO
    RouterModule,
  ],
  templateUrl: './sidebar.html',
})
export class Sidebar {
  // Arranca abierto para desktop
  isOpen = false;

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }
}
