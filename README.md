# Pokédex Full-Stack

## Descripción del Proyecto

Aplicación web Pokédex que permite buscar información de Pokémones mediante la PokéAPI pública y gestionar una colección personalizada de favoritos con apodos. El proyecto combina un frontend desarrollado en Angular con un backend API RESTful construido en Node.js/Express y MongoDB.


## Enlaces de Despliegue

- **Frontend:** [https://pokedex-full-stack-jeft.vercel.app/search](https://pokedex-full-stack-jeft.vercel.app/search)
- **Backend:** [https://pokedex-fullstack-jeft.onrender.com/api/favorites](https://pokedex-fullstack-jeft.onrender.com/api/favorites)


## Características Principales

- Búsqueda de Pokémon por nombre o número desde la PokéAPI
- Sistema completo de gestión de favoritos con persistencia en MongoDB
- Asignación y edición de apodos personalizados para cada favorito
- Galería visual de todos los Pokémon guardados como favoritos
- Carrusel dinámico con Pokémon aleatorios
- Interfaz responsiva con estados de carga y manejo de errores
- Arquitectura desacoplada frontend-backend con comunicación REST

## Tecnologías Utilizadas

### Frontend
- Angular 18 con TypeScript
- Componentes standalone y Signals para reactividad
- CSS3 con diseño responsivo y animaciones

### Backend
- Node.js con Express.js
- MongoDB con Mongoose ODM
- TypeScript para tipado estático
- CORS habilitado para comunicación cross-origin

### APIs
- PokéAPI (https://pokeapi.co/) para datos de Pokémon
- API REST propia para gestión de favoritos

## Requisitos Previos

- Node.js v18 o superior
- MongoDB (local o MongoDB Atlas)
- npm o yarn como gestor de paquetes

## Instalación y Ejecución

### 1. Clonar el repositorio

```bash
git clone <url-del-repositorio>
cd Pokedex
```

### 2. Configurar el Backend

```bash
cd backend
npm install
```

Crear un archivo `.env` en la carpeta `backend/` con las siguientes variables:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/pokedex
```

Para MongoDB Atlas se debe usar la cadena de conexion:
```env
MONGODB_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/pokedex
```

### 3. Configurar el Frontend

```bash
cd ../frontend
npm install
```

### 4. Ejecutar la Aplicación

Necesitarás dos terminales abiertas simultáneamente:

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
El servidor estará disponible en `http://localhost:3000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
La aplicación Angular se abrirá automáticamente en `http://localhost:4200`

## Estructura del Proyecto

```
Pokedex/
├── backend/
│   ├── src/
│   │   ├── config/           # Configuración de base de datos
│   │   ├── controllers/      # Lógica de negocio (CRUD)
│   │   ├── models/           # Esquemas de Mongoose
│   │   ├── routes/           # Definición de endpoints
│   │   └── index.ts          # Punto de entrada del servidor
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/app/
│   │   ├── components/       # Componentes de UI
│   │   ├── services/         # Servicios HTTP
│   │   ├── interfaces/       # Definiciones de tipos
│   │   └── app.ts            # Componente raíz
│   ├── package.json
│   └── angular.json
└── README.md
```

## Endpoints de la API

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/favorites` | Obtiene todos los Pokémon favoritos |
| POST | `/api/favorites` | Añade un nuevo Pokémon a favoritos |
| PUT | `/api/favorites/:pokemonId` | Actualiza el apodo de un favorito |
| DELETE | `/api/favorites/:pokemonId` | Elimina un Pokémon de favoritos |

### Ejemplos de Peticiones

**GET /api/favorites**
```json
Respuesta: [
  { "id": 25, "name": "pikachu", "nickname": "Pika" },
  { "id": 6, "name": "charizard", "nickname": "El Dragón" }
]
```

**POST /api/favorites**
```json
Body: { "id": 6, "name": "charizard" }
Respuesta: { "id": 6, "name": "charizard", "nickname": null }
```

**PUT /api/favorites/6**
```json
Body: { "nickname": "El Dragón" }
Respuesta: { "id": 6, "name": "charizard", "nickname": "El Dragón" }
```

**DELETE /api/favorites/6**
```
Status: 204 No Content
```

## Decisiones Técnicas

### Arquitectura y Estructura

Decidí explorar Angular y Express en este proyecto para aprender sobre el desarrollo full-stack moderno. Angular me permitió trabajar con componentes reutilizables, señales reactivas y un sistema de inyección de dependencias muy potente, mientras que Express facilitó la creación de una API RESTful clara y flexible usando el patrón MVC. Gracias a estas tecnologías, pude implementar funcionalidades como gestión de favoritos, edición de apodos y una interfaz responsiva, además de comprender mejor la integración entre frontend y backend.

### Elección de Angular

Elegí Angular por varias razones estratégicas:
1. **Sistema de inyección de dependencias**: Permite una gestión limpia de servicios compartidos
2. **TypeScript nativo**: Proporciona tipado estático que reduce errores en tiempo de desarrollo
3. **Componentes standalone**: Simplifica la estructura eliminando la necesidad de módulos tradicionales
4. **Signals para reactividad**: Implementación moderna que mejora el rendimiento sobre observables en casos específicos

### Base de Datos MongoDB

Decidí implementar MongoDB en lugar de una base de datos en memoria por:
- **Persistencia real**: Los datos sobreviven a reinicios del servidor
- **Escalabilidad**: Preparado para crecimiento futuro sin cambios arquitectónicos mayores
- **Flexibilidad del esquema**: Los documentos JSON de MongoDB se alinean naturalmente con las respuestas de la PokéAPI
- **Mongoose ODM**: Proporciona validación de datos y abstracción elegante

### Gestión de Estado y Comunicación

Implementé una arquitectura de servicios inyectables que centralizan toda la lógica de comunicación HTTP:
- `PokeapiService`: Maneja exclusivamente peticiones a la API pública
- `FavoritesService`: Gestiona el CRUD completo con el backend propio

Esta separación de responsabilidades facilita el testing unitario y permite cambiar proveedores de datos sin afectar los componentes.

### Manejo de Errores y Estados de Carga

Implementé un sistema robusto de estados para cada operación asíncrona:
- Estados de carga (loading) para mejorar UX durante peticiones
- Manejo explícito de errores con mensajes descriptivos
- Validaciones en el backend para evitar duplicados
- Respuestas HTTP semánticas (201, 204, 404, 409, 500)

### Optimización de Rendimiento

Añadí un carrusel con Pokémon aleatorios que:
- Muestra un spinner durante la carga inicial
- Rota automáticamente cada 1.8 segundos
- Refresca el contenido cada 1 rotaciones completas


### Diseño y Experiencia de Usuario

Prioricé una interfaz limpia y moderna:
- Gradientes suaves y efectos de vidrio (glassmorphism)
- Animaciones de transición fluidas
- Diseño responsivo que se adapta a móviles y desktop
- Feedback visual inmediato en todas las interacciones

### Seguridad y Buenas Prácticas

- CORS configurado específicamente (no wildcard en producción)
- Validación de datos en el backend antes de guardar
- Variables de entorno para configuración sensible
- Índices únicos en MongoDB para evitar duplicados
- Tipado estático end-to-end con TypeScript

## Funcionalidades Implementadas

- Backend con Express.js y endpoints RESTful
- Frontend con búsqueda de Pokémon
- Gestión de favoritos (añadir/eliminar)
- Actualización de apodos
- Estados de carga y errores
- CORS habilitado

- Frontend desarrollado con Angular
- Base de datos MongoDB con Mongoose
- Vista "Mis Favoritos" con galería completa
- Diseño responsivo y UX pulida
- Componentes standalone y Signals
- Carrusel dinámico de Pokémon

## Scripts Disponibles

### Backend
```bash
npm run dev      # Desarrollo con hot-reload (nodemon)
npm run build    # Compilar TypeScript a JavaScript
npm start        # Ejecutar versión compilada
```

### Frontend
```bash
npm start        # Servidor de desarrollo (ng serve)
npm run build    # Build de producción optimizado
npm test         # Ejecutar tests unitarios
```

## Autor

Proyecto desarrollado por Esteban Fajardo Torres como prueba técnica Full-Stack, demostrando capacidad de integración de múltiples tecnologías, arquitectura escalable y atención al detalle en la experiencia de usuario.

