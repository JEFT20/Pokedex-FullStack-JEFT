import { Router } from 'express';
import {
  getFavorites,
  addFavorite,
  updateNickname,
  deleteFavorite,
} from '../controllers/favorite.controller.js';

// Aquí defino todas las rutas de mi API para manejar favoritos.
// Cada ruta apunta a una función específica del controlador que maneja la lógica.

const router = Router();

router.get('/', getFavorites);
router.post('/', addFavorite);
router.put('/:pokemonId', updateNickname);
router.delete('/:pokemonId', deleteFavorite);

export default router;
