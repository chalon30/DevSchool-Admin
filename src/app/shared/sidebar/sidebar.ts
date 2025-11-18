import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './sidebar.html',
})
export class Sidebar {
  isOpen = false;

  toggleSidebar() {
    this.isOpen = !this.isOpen;
  }
}
