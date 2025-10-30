// Aquí defino cómo se ve un Pokémon favorito que viene de mi backend.
// Esta interfaz coincide con lo que mi API devuelve y me ayuda con el tipado.

export interface FavoritePokemon {
  id: number;
  name: string;
  nickname: string | null;
}