import mongoose from 'mongoose';
import { config } from './index.js';

// Aquí manejo la conexión a MongoDB usando Mongoose.
// Esta función se ejecuta al iniciar el servidor y establece la conexión con la base de datos.

export const connectDB = async () => {
  try {
    await mongoose.connect(config.mongodb_uri);
    console.log('>>> Conexión a MongoDB exitosa');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1);
  }
};
