import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FavoritePokemon } from '../interfaces/favorite.interface';

// Este servicio maneja toda la comunicación con mi API backend de favoritos.
// Aquí hago las peticiones CRUD para obtener, añadir, actualizar apodos y eliminar favoritos.

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private apiUrl = 'https://pokedex-fullstack-jeft.onrender.com/api';

  constructor(private http: HttpClient) {}

  getFavorites(): Observable<FavoritePokemon[]> {
    return this.http.get<FavoritePokemon[]>(`${this.apiUrl}/favorites`);
  }

  addFavorite(pokemon: { id: number; name: string }): Observable<FavoritePokemon> {
    return this.http.post<FavoritePokemon>(`${this.apiUrl}/favorites`, pokemon);
  }

  updateNickname(pokemonId: number, nickname: string): Observable<FavoritePokemon> {
    return this.http.put<FavoritePokemon>(`${this.apiUrl}/favorites/${pokemonId}`, { nickname });
  }

  deleteFavorite(pokemonId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/favorites/${pokemonId}`);
  }
}