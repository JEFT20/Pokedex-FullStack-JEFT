// Aquí defino la estructura de datos que espero recibir de la PokéAPI.
// Esta interfaz me ayuda a tener autocompletado y validación de tipos en TypeScript.

export interface Pokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string;
    other?: {
      'official-artwork'?: {
        front_default: string;
      };
      'dream_world'?: {
        front_default: string;
      };
    };
  };
  types: Array<{
    type: {
      name: string;
    };
  }>;
  stats: Array<{
    base_stat: number;
    stat: {
      name: string;
    };
  }>;
}