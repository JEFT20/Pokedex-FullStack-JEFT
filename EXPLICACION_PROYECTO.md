
## Estructura Completa del Proyecto

### **Backend** (`backend/`)

#### **Carpeta `src/`**
Todo el código fuente del servidor Express.

##### **`index.ts`**
- **¿Qué es?** El punto de entrada del servidor
- **¿Qué hace?**
  1. Importa Express y todas las dependencias
  2. Conecta a MongoDB llamando `connectDB()`
  3. Configura CORS para permitir peticiones desde el frontend
  4. Habilita `express.json()` para recibir datos JSON
  5. Monta las rutas de favoritos en `/api`
  6. Levanta el servidor en el puerto configurado (3000)
- **Ejemplo:** Cuando ejecutas `npm run dev`, este archivo se ejecuta primero

##### **Carpeta `config/`**
Configuración centralizada del proyecto.

**`database.ts`**
- **¿Qué hace?** Exporta la función `connectDB()` que conecta Mongoose con MongoDB
- **Detalle:** Si falla la conexión, termina el proceso con `process.exit(1)`

**`index.ts`**
- **¿Qué hace?** Carga las variables del archivo `.env` y las exporta
- **Variables:** `PORT` (puerto del servidor) y `MONGODB_URI` (URL de la base de datos)

##### **Carpeta `models/`**
Define la estructura de datos en MongoDB.

**`favorite.model.ts`**
- **¿Qué hace?** Crea el esquema Mongoose para favoritos
- **Campos:**
  - `id`: número único del Pokémon
  - `name`: nombre del Pokémon
  - `nickname`: apodo opcional (puede ser null)
- **Restricción:** El campo `id` es único, no puede haber dos favoritos con el mismo Pokémon

##### **Carpeta `controllers/`**
Lógica de negocio del CRUD.

**`favorite.controller.ts`**
Contiene 4 funciones:

1. **`getFavorites()`**
   - Obtiene todos los favoritos de la base de datos
   - Responde con status 200 y un array JSON

2. **`addFavorite()`**
   - Recibe `{ id, name }` en el body
   - Verifica si ya existe con `findOne({ id })`
   - Si existe: responde 409 (conflicto)
   - Si no existe: crea el favorito y responde 201

3. **`updateNickname()`**
   - Recibe `pokemonId` por parámetro y `{ nickname }` en el body
   - Busca el favorito y actualiza el apodo
   - Si no existe: responde 404
   - Si existe: responde 200 con el favorito actualizado

4. **`deleteFavorite()`**
   - Recibe `pokemonId` por parámetro
   - Busca y elimina el favorito
   - Si no existe: responde 404
   - Si existe: responde 204 (sin contenido)

##### **Carpeta `routes/`**
Define las URLs de la API.

**`favorite.routes.ts`**
- **¿Qué hace?** Conecta cada URL con su función del controlador
- **Rutas:**
  - `GET /favorites` → `getFavorites()`
  - `POST /favorites` → `addFavorite()`
  - `PUT /favorites/:pokemonId` → `updateNickname()`
  - `DELETE /favorites/:pokemonId` → `deleteFavorite()`

#### **Archivos de configuración del backend**

**`.env`**
- Variables de entorno secretas (no se sube a Git)
- Ejemplo: `MONGODB_URI=mongodb+srv://...`

**`package.json`**
- Dependencias: Express, Mongoose, CORS, dotenv
- Scripts:
  - `npm run dev`: compila TypeScript y ejecuta
  - `npm run build`: solo compila a JavaScript
  - `npm start`: ejecuta el código compilado

**`tsconfig.json`**
- Configuración de TypeScript
- `outDir: "dist"`: el código compilado va a la carpeta `dist`
- `module: "ESNext"`: usa módulos modernos de JavaScript

---

### **Frontend** (`frontend/`)

#### **Carpeta `src/`**
Todo el código fuente de Angular.

##### **`index.html`**
- El archivo HTML principal
- Solo tiene `<app-root></app-root>`, Angular inyecta todo lo demás

##### **`main.ts`**
- Punto de entrada de Angular
- Inicializa la aplicación con `bootstrapApplication(App, appConfig)`

##### **`styles.css`**
- Estilos globales (fondo animado con gradiente)

##### **Carpeta `app/`**
El corazón de la aplicación Angular.

**`app.ts`**
- Componente raíz
- Muestra la navegación y el `<router-outlet>` para las páginas
- Controla cuándo mostrar el carrusel (solo en `/search`)

**`app.html`**
- Template del componente raíz
- Tiene el header con navegación y el contenido dinámico

**`app.css`**
- Estilos del header (glassmorphism con blur y gradientes)

**`app.config.ts`**
- Configuración global de Angular
- Habilita el router y HttpClient

**`app.routes.ts`**
- Define las rutas:
  - `/` → redirige a `/search`
  - `/search` → muestra `PokemonSearchComponent`
  - `/favorites` → muestra `FavoritesListComponent`
  - Cualquier otra → redirige a `/search`

##### **Carpeta `services/`**
Servicios para comunicación HTTP.

**`pokeapi.service.ts`**
- Se comunica con la PokéAPI pública
- Método: `getPokemon(nameOrId)` → devuelve Observable de Pokémon

**`favorites.service.ts`**
- Se comunica con nuestro backend en `localhost:3000`
- Métodos:
  - `getFavorites()` → GET /api/favorites
  - `addFavorite(pokemon)` → POST /api/favorites
  - `updateNickname(id, nickname)` → PUT /api/favorites/:id
  - `deleteFavorite(id)` → DELETE /api/favorites/:id

##### **Carpeta `interfaces/`**
Definiciones de tipos TypeScript.

**`pokemon.interface.ts`**
- Define la estructura de datos de la PokéAPI
- Campos: id, name, height, weight, sprites, types, stats

**`favorite.interface.ts`**
- Define la estructura de favoritos del backend
- Campos: id, name, nickname

##### **Carpeta `components/`**
Componentes reutilizables de UI.

**`pokemon-search/`**
- **TS:** Maneja el input de búsqueda, estados de carga y error
- **HTML:** Formulario de búsqueda y muestra `<app-pokemon-detail>`
- **CSS:** Estilos del buscador y spinner de carga

**`pokemon-detail/`**
- **TS:** Muestra detalles del Pokémon, botones de favoritos y gestión de apodos
- **HTML:** Tarjeta con imagen, stats, tipos, altura, peso y botones
- **CSS:** Estilos de la tarjeta con animaciones y gradientes
- **Funcionalidad extra:** Botón "X" para cerrar la tarjeta

**`favorites-list/`**
- **TS:** Carga favoritos del backend, obtiene detalles de PokéAPI y permite editar/eliminar
- **HTML:** Grid de tarjetas con cada favorito
- **CSS:** Galería responsive con tarjetas hover

**`pokemon-carousel/`**
- **TS:** Carga 5 Pokémon aleatorios y los rota cada 1.8 segundos
- **HTML:** Carrusel horizontal con Pokémon
- **CSS:** Animaciones de rotación y transiciones suaves

##### **Carpeta `utils/`**
Funciones auxiliares compartidas.

**`pokemon-colors.util.ts`**
- Función `getTypeColor(type)` que devuelve el color hexadecimal de cada tipo de Pokémon
- Usada por `pokemon-detail` y `favorites-list`

#### **Archivos de configuración del frontend**

**`package.json`**
- Dependencias: Angular, RxJS, Zone.js
- Scripts:
  - `npm start`: ejecuta `ng serve` (servidor de desarrollo)
  - `npm run build`: compila para producción

**`angular.json`**
- Configuración de Angular CLI
- Define dónde están los archivos fuente y dónde va el output

**`tsconfig.json`**
- Configuración base de TypeScript para Angular

**`tsconfig.app.json`**
- Configuración específica para la app (excluye tests)

**`tsconfig.spec.json`**
- Configuración específica para tests

---

## 🔄 Flujo Completo de una Operación

### Ejemplo: Añadir un Pokémon a favoritos

1. **Frontend (`pokemon-detail.component.ts`):**
   - Usuario presiona "Añadir a Favoritos"
   - Se ejecuta `toggleFavorite()`
   - Llama a `favoritesService.addFavorite({ id: 25, name: 'pikachu' })`

2. **Servicio (`favorites.service.ts`):**
   - Crea una petición HTTP POST a `http://localhost:3000/api/favorites`
   - Envía el body: `{ "id": 25, "name": "pikachu" }`

3. **Backend - Rutas (`favorite.routes.ts`):**
   - Recibe la petición en `POST /api/favorites`
   - Llama a la función `addFavorite` del controlador

4. **Backend - Controlador (`favorite.controller.ts`):**
   - Extrae `id` y `name` del body
   - Busca si ya existe con `FavoritePokemon.findOne({ id: 25 })`
   - Si no existe, crea `new FavoritePokemon({ id: 25, name: 'pikachu' })`
   - Guarda en MongoDB con `.save()`
   - Responde: `{ "id": 25, "name": "pikachu", "nickname": null }`

5. **Base de datos (MongoDB):**
   - Se inserta un nuevo documento en la colección `favoritepokemon`

6. **Frontend - Componente:**
   - Recibe la respuesta exitosa
   - Actualiza `isFavorite.set(true)`
   - Muestra mensaje "Pokémon añadido a favoritos"



