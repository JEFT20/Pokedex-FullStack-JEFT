import express from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import { connectDB } from './config/database.js';
import favoriteRoutes from './routes/favorite.routes.js';

// Este es el punto de entrada de mi servidor Express. Aquí configuro todo lo necesario para que mi API funcione:
// conecto a MongoDB, habilito CORS para el frontend, proceso JSON y registro las rutas de favoritos.

const app = express();

connectDB();

app.use(cors({
  origin: ['http://localhost:4200', 'https://pokedex-full-stack-jeft.vercel.app'],
  credentials: true
}));
app.use(express.json());

app.use('/api/favorites', favoriteRoutes);

app.get('/', (_req, res) => {
  res.send('API de Pokédex funcionando correctamente');
});

app.listen(config.port, () => {
  console.log(`Servidor Express escuchando en http://localhost:${config.port}`);
});
