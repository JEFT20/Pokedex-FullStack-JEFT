import { Schema, model, Document } from 'mongoose';

// Aquí defino cómo se verá un Pokémon favorito en mi base de datos MongoDB. 
// Uso Mongoose para crear un esquema que guarda el id, nombre y apodo opcional de cada Pokémon.

export interface IFavoritePokemon extends Document {
  id: number;
  name: string;
  nickname: string | null;
}

const FavoritePokemonSchema = new Schema<IFavoritePokemon>({
  id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  nickname: { type: String, default: null },
});

export const FavoritePokemon = model<IFavoritePokemon>('FavoritePokemon', FavoritePokemonSchema);
