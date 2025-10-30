import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pokemon } from '../interfaces/pokemon.interface';

// Este servicio maneja todas las peticiones a la PokéAPI pública.
// Lo uso para buscar información de Pokémon por nombre o número desde cualquier componente.

@Injectable({
  providedIn: 'root'
})
export class PokeapiService {
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon';

  constructor(private http: HttpClient) {}

  getPokemon(nameOrId: string | number): Observable<Pokemon> {
    return this.http.get<Pokemon>(`${this.apiUrl}/${nameOrId.toString().toLowerCase()}`);
  }
}