import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from "./shared/sidebar/sidebar";
import { User } from "./shared/users/users";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Sidebar, User],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('devschool-admin');
}
