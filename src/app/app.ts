import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Usuarios } from "./pages/usuarios/usuarios";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Usuarios],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('devschool-admin');
}
