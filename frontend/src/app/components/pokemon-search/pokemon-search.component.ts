import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PokeapiService } from '../../services/pokeapi.service';
import { Pokemon } from '../../interfaces/pokemon.interface';
import { PokemonDetailComponent } from '../pokemon-detail/pokemon-detail.component';

// Este componente maneja la búsqueda de Pokémon en la PokéAPI.
// Aquí el usuario puede escribir un nombre o número, buscar y ver los resultados con estados de carga y error.

@Component({
  selector: 'app-pokemon-search',
  standalone: true,
  imports: [FormsModule, CommonModule, PokemonDetailComponent],
  templateUrl: './pokemon-search.component.html',
  styleUrls: ['./pokemon-search.component.css']
})
export class PokemonSearchComponent {
  searchTerm = signal('');
  pokemon = signal<Pokemon | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(private pokeapiService: PokeapiService) {}

  searchPokemon() {
    const term = this.searchTerm().trim();
    if (!term) return;

    this.loading.set(true);
    this.error.set(null);
    this.pokemon.set(null);

    this.pokeapiService.getPokemon(term).subscribe({
      next: (pokemon) => {
        this.pokemon.set(pokemon);
        this.loading.set(false);
        this.searchTerm.set('');
      },
      error: (err) => {
        this.error.set('Pokémon no encontrado. Intenta con otro nombre o número.');
        this.loading.set(false);
        this.searchTerm.set('');
      }
    });
  }

  closePokemonDetail() {
    this.pokemon.set(null);
    this.error.set(null);
  }
}