import { Routes } from '@angular/router';
import { PokemonSearchComponent } from './components/pokemon-search/pokemon-search.component';
import { FavoritesListComponent } from './components/favorites-list/favorites-list.component';

// Aquí defino todas las rutas de mi aplicación.
// Controlo qué componente se muestra según la URL y establezco redirects para rutas inexistentes.

export const routes: Routes = [
  { path: '', redirectTo: '/search', pathMatch: 'full' },
  { path: 'search', component: PokemonSearchComponent },
  { path: 'favorites', component: FavoritesListComponent },
  { path: '**', redirectTo: '/search' }
];
