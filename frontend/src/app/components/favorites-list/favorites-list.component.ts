import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FavoritesService } from '../../services/favorites.service';
import { PokeapiService } from '../../services/pokeapi.service';
import { FavoritePokemon } from '../../interfaces/favorite.interface';
import { Pokemon } from '../../interfaces/pokemon.interface';
import { getTypeColor } from '../../utils/pokemon-colors.util';

// Este componente muestra mi galería de Pokémon favoritos.
// Aquí cargo todos los favoritos, los enriquezco con datos de la PokéAPI y permito editarlos o eliminarlos.

interface FavoriteWithDetails extends FavoritePokemon {
  pokemonData?: Pokemon;
  loading?: boolean;
}

@Component({
  selector: 'app-favorites-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './favorites-list.component.html',
  styleUrls: ['./favorites-list.component.css']
})
export class FavoritesListComponent implements OnInit {
  favorites = signal<FavoriteWithDetails[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  editingNickname = signal<number | null>(null);
  tempNickname = signal('');
  flippedCards = signal<Set<number>>(new Set());

  constructor(
    private favoritesService: FavoritesService,
    private pokeapiService: PokeapiService
  ) {}

  ngOnInit() {
    this.loadFavorites();
  }

  loadFavorites() {
    this.loading.set(true);
    this.error.set(null);

    this.favoritesService.getFavorites().subscribe({
      next: (favorites) => {
        const favoritesWithDetails: FavoriteWithDetails[] = favorites.map(fav => ({
          ...fav,
          loading: true
        }));
        this.favorites.set(favoritesWithDetails);
        this.loading.set(false);
        
        this.loadPokemonDetails();
      },
      error: (err) => {
        this.error.set('Error al cargar favoritos');
        this.loading.set(false);
      }
    });
  }

  private loadPokemonDetails() {
    const favorites = this.favorites();
    favorites.forEach((favorite, index) => {
      this.pokeapiService.getPokemon(favorite.id).subscribe({
        next: (pokemon) => {
          const updatedFavorites = [...this.favorites()];
          updatedFavorites[index] = {
            ...updatedFavorites[index],
            pokemonData: pokemon,
            loading: false
          };
          this.favorites.set(updatedFavorites);
        },
        error: (err) => {
          const updatedFavorites = [...this.favorites()];
          updatedFavorites[index] = {
            ...updatedFavorites[index],
            loading: false
          };
          this.favorites.set(updatedFavorites);
        }
      });
    });
  }

  deleteFavorite(pokemonId: number) {
    if (confirm('¿Estás seguro de que quieres eliminar este Pokémon de favoritos?')) {
      this.favoritesService.deleteFavorite(pokemonId).subscribe({
        next: () => {
          const updatedFavorites = this.favorites().filter(f => f.id !== pokemonId);
          this.favorites.set(updatedFavorites);
        },
        error: (err) => {
          this.error.set('Error al eliminar favorito');
        }
      });
    }
  }

  startEditingNickname(pokemonId: number, currentNickname: string) {
    this.editingNickname.set(pokemonId);
    this.tempNickname.set(currentNickname || '');
  }

  saveNickname(pokemonId: number) {
    const nickname = this.tempNickname().trim();
    
    this.favoritesService.updateNickname(pokemonId, nickname).subscribe({
      next: (updatedFavorite) => {
        const updatedFavorites = this.favorites().map(f => 
          f.id === pokemonId ? { ...f, nickname: updatedFavorite.nickname } : f
        );
        this.favorites.set(updatedFavorites);
        this.editingNickname.set(null);
      },
      error: (err) => {
        this.error.set('Error al actualizar el apodo');
      }
    });
  }

  cancelEditing() {
    this.editingNickname.set(null);
    this.tempNickname.set('');
  }

  toggleFlip(pokemonId: number) {
    const flipped = new Set(this.flippedCards());
    if (flipped.has(pokemonId)) {
      flipped.delete(pokemonId);
    } else {
      flipped.add(pokemonId);
    }
    this.flippedCards.set(flipped);
  }

  isFlipped(pokemonId: number): boolean {
    return this.flippedCards().has(pokemonId);
  }

  translateStat(statName: string): string {
    const translations: { [key: string]: string } = {
      'hp': 'Salud',
      'attack': 'Ataque',
      'defense': 'Defensa',
      'special-attack': 'Ataque Esp.',
      'special-defense': 'Defensa Esp.',
      'speed': 'Velocidad'
    };
    return translations[statName] || statName;
  }

  getMainImage(pokemon: Pokemon): string {
    return pokemon.sprites.other?.['official-artwork']?.front_default || 
           pokemon.sprites.front_default;
  }

  getTypeColor = getTypeColor;
}