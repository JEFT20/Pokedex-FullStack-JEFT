import { Component, OnInit, signal } from '@angular/core';
import { PokeapiService } from '../../services/pokeapi.service';
import { TitleCasePipe, NgFor} from '@angular/common';

// Este componente crea el carrusel giratorio que muestra Pokémon aleatorios.
// Se actualiza automáticamente cada cierto tiempo y solo aparece en la página de búsqueda.

interface CarouselPokemon {
  id: number;
  name: string;
  image: string;
}

@Component({
  selector: 'app-pokemon-carousel',
  standalone: true,
  templateUrl: './pokemon-carousel.component.html',
  styleUrl: './pokemon-carousel.component.css',
  imports: [NgFor, TitleCasePipe],
})
export class PokemonCarouselComponent implements OnInit {
  pokemons = signal<CarouselPokemon[]>([]);
  currentIndex = signal(0);
  rotationCount = signal(0);
  loading = signal(true);
  intervalId: any;

  constructor(private pokeapi: PokeapiService) {}

  ngOnInit(): void {
    this.loadRandomPokemons();
    this.startCarousel();
  }

  async loadRandomPokemons() {
    this.loading.set(true);
    const randomIds = Array.from({ length: 5 }, () => Math.floor(Math.random() * 898) + 1);
    const promises = randomIds.map(async (id) => {
      const data = await this.pokeapi.getPokemon(id).toPromise();
      if (!data) {
        return { id, name: 'Desconocido', image: '' };
      }
      return {
        id: data.id,
        name: data.name,
        image: data.sprites?.other?.['official-artwork']?.front_default || data.sprites?.front_default || ''
      };
    });
    this.pokemons.set(await Promise.all(promises));
    this.currentIndex.set(0);
    this.loading.set(false);
  }

  startCarousel() {
    this.intervalId = setInterval(() => {
      this.currentIndex.set((this.currentIndex() + 1) % 5);
      if (this.currentIndex() === 0) {
        this.rotationCount.set(this.rotationCount() + 1);
        if (this.rotationCount() % 2 === 0) {
          this.loadRandomPokemons();
        }
      }
    }, 1800);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }
}
