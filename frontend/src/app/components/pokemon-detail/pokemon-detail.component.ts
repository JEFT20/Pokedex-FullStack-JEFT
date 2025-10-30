import { Component, Input, Output, EventEmitter, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Pokemon } from '../../interfaces/pokemon.interface';
import { FavoritesService } from '../../services/favorites.service';
import { getTypeColor } from '../../utils/pokemon-colors.util';

// Este componente muestra toda la información detallada de un Pokémon.
// Manejo los botones de favoritos, actualización de apodos y toda la lógica relacionada con favoritos.

@Component({
  selector: 'app-pokemon-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.css']
})
export class PokemonDetailComponent implements OnInit {
  @Input() pokemon!: Pokemon;
  @Output() close = new EventEmitter<void>();
  
  isFavorite = signal(false);
  nickname = signal('');
  loading = signal(false);
  message = signal<string | null>(null);

  constructor(private favoritesService: FavoritesService) {}

  ngOnInit() {
    this.checkIfFavorite();
  }

  closeDetail() {
    this.close.emit();
  }

  checkIfFavorite() {
    this.favoritesService.getFavorites().subscribe({
      next: (favorites) => {
        const favorite = favorites.find(f => f.id === this.pokemon.id);
        if (favorite) {
          this.isFavorite.set(true);
          this.nickname.set(favorite.nickname || '');
        }
      },
      error: (err) => {
        console.error('Error checking favorites:', err);
      }
    });
  }

  toggleFavorite() {
    this.loading.set(true);
    this.message.set(null);

    if (this.isFavorite()) {
      this.favoritesService.deleteFavorite(this.pokemon.id).subscribe({
        next: () => {
          this.isFavorite.set(false);
          this.nickname.set('');
          this.loading.set(false);
          this.showMessage('Pokémon eliminado de favoritos', 'success');
        },
        error: (err) => {
          this.loading.set(false);
          this.showMessage('Error al eliminar de favoritos', 'error');
        }
      });
    } else {
      this.favoritesService.addFavorite({
        id: this.pokemon.id,
        name: this.pokemon.name
      }).subscribe({
        next: () => {
          this.isFavorite.set(true);
          this.loading.set(false);
          this.showMessage('Pokémon añadido a favoritos', 'success');
        },
        error: (err) => {
          this.loading.set(false);
          if (err.status === 409) {
            this.showMessage('Este Pokémon ya está en favoritos', 'error');
          } else {
            this.showMessage('Error al añadir a favoritos', 'error');
          }
        }
      });
    }
  }

  saveNickname() {
    if (!this.isFavorite()) return;

    this.loading.set(true);
    this.message.set(null);

    this.favoritesService.updateNickname(this.pokemon.id, this.nickname()).subscribe({
      next: () => {
        this.loading.set(false);
        this.showMessage('Apodo guardado correctamente', 'success');
      },
      error: (err) => {
        this.loading.set(false);
        this.showMessage('Error al guardar el apodo', 'error');
      }
    });
  }

  private showMessage(text: string, type: 'success' | 'error') {
    this.message.set(text);
    setTimeout(() => this.message.set(null), 3000);
  }

  getMainImage(): string {
    return this.pokemon.sprites.other?.['official-artwork']?.front_default || 
           this.pokemon.sprites.front_default;
  }

  getTypeColor = getTypeColor;

  
  translateStat(stat: string): string {
    const map: Record<string, string> = {
      hp: 'Salud',
      attack: 'Ataque',
      defense: 'Defensa',
      'special-attack': 'Ataque Esp.',
      'special-defense': 'Defensa Esp.',
      speed: 'Velocidad'
    };
    return map[stat] || stat;
  }
}