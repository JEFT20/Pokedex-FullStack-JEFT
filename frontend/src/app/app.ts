import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { PokemonCarouselComponent } from './components/pokemon-carousel/pokemon-carousel.component';

// Este es el componente principal de mi aplicación Angular.
// Aquí manejo la navegación, controlo qué ruta está activa y decido dónde mostrar el carrusel de Pokémon.

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, PokemonCarouselComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Pokedex');
  route = signal('');

  constructor(private router: Router) {
    this.router.events.subscribe(() => {
      this.route.set(this.router.url);
    });
    this.route.set(this.router.url);
  }
}
