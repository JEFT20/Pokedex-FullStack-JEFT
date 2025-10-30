import type { Request, Response } from 'express';
import { FavoritePokemon } from '../models/favorite.model.js';

// Aquí manejo toda la lógica de negocio para los favoritos. 
// Estas funciones procesan las peticiones HTTP: obtener todos los favoritos, añadir nuevos, 
// actualizar apodos y eliminar favoritos de la base de datos.

export const getFavorites = async (_req: Request, res: Response) => {
  try {
    const favorites = await FavoritePokemon.find();
    res.status(200).json(favorites);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los favoritos' });
  }
};

export const addFavorite = async (req: Request, res: Response) => {
  try {
    const { id, name } = req.body;
    const existingFavorite = await FavoritePokemon.findOne({ id });

    if (existingFavorite) {
      return res.status(409).json({ message: 'El Pokémon ya está en favoritos' });
    }

    const newFavorite = new FavoritePokemon({ id, name });
    await newFavorite.save();
    res.status(201).json(newFavorite);
  } catch (error) {
    res.status(500).json({ message: 'Error al añadir el favorito' });
  }
};

export const updateNickname = async (req: Request, res: Response) => {
  try {
    const { pokemonId } = req.params;
    const { nickname } = req.body;

    const updatedFavorite = await FavoritePokemon.findOneAndUpdate(
      { id: pokemonId },
      { nickname },
      { new: true }
    );

    if (!updatedFavorite) {
      return res.status(404).json({ message: 'Pokémon no encontrado en favoritos' });
    }

    res.status(200).json(updatedFavorite);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el apodo' });
  }
};

export const deleteFavorite = async (req: Request, res: Response) => {
  try {
    const { pokemonId } = req.params;
    const deletedFavorite = await FavoritePokemon.findOneAndDelete({ id: pokemonId });

    if (!deletedFavorite) {
      return res.status(404).json({ message: 'Pokémon no encontrado en favoritos' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el favorito' });
  }
};
