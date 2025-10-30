import dotenv from 'dotenv';

// Aquí cargo y exporto todas las variables de configuración de mi aplicación.
// Leo las variables de entorno del archivo .env y defino valores por defecto.

dotenv.config();

export const config = {
  port: process.env.PORT || 3000,
  mongodb_uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/pokedex',
};
