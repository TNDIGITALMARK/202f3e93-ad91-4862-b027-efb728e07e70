export interface Pokemon {
  id: number;
  name: string;
  species: string;
  height: number;
  weight: number;
  base_experience: number;
  order: number;
  is_default: boolean;
  location_area_encounters: string;
  sprites: PokemonSprites;
  abilities: PokemonAbility[];
  forms: NamedAPIResource[];
  game_indices: GameIndex[];
  held_items: PokemonHeldItem[];
  moves: PokemonMove[];
  past_types: PokemonTypePast[];
  stats: PokemonStat[];
  types: PokemonType[];
  species_url?: string;
}

export interface PokemonSprites {
  back_default?: string;
  back_female?: string;
  back_shiny?: string;
  back_shiny_female?: string;
  front_default?: string;
  front_female?: string;
  front_shiny?: string;
  front_shiny_female?: string;
  other?: {
    dream_world?: {
      front_default?: string;
      front_female?: string;
    };
    home?: {
      front_default?: string;
      front_female?: string;
      front_shiny?: string;
      front_shiny_female?: string;
    };
    'official-artwork'?: {
      front_default?: string;
      front_shiny?: string;
    };
    showdown?: {
      back_default?: string;
      back_female?: string;
      back_shiny?: string;
      back_shiny_female?: string;
      front_default?: string;
      front_female?: string;
      front_shiny?: string;
      front_shiny_female?: string;
    };
  };
  versions?: any;
}

export interface PokemonAbility {
  is_hidden: boolean;
  slot: number;
  ability: NamedAPIResource;
}

export interface PokemonType {
  slot: number;
  type: NamedAPIResource;
}

export interface PokemonStat {
  base_stat: number;
  effort: number;
  stat: NamedAPIResource;
}

export interface PokemonMove {
  move: NamedAPIResource;
  version_group_details: PokemonMoveVersion[];
}

export interface PokemonMoveVersion {
  level_learned_at: number;
  move_learn_method: NamedAPIResource;
  version_group: NamedAPIResource;
}

export interface PokemonHeldItem {
  item: NamedAPIResource;
  version_details: PokemonHeldItemVersion[];
}

export interface PokemonHeldItemVersion {
  rarity: number;
  version: NamedAPIResource;
}

export interface PokemonTypePast {
  generation: NamedAPIResource;
  types: PokemonType[];
}

export interface GameIndex {
  game_index: number;
  version: NamedAPIResource;
}

export interface NamedAPIResource {
  name: string;
  url: string;
}

export interface APIResource {
  url: string;
}

// Pokemon Species
export interface PokemonSpecies {
  id: number;
  name: string;
  order: number;
  gender_rate: number;
  capture_rate: number;
  base_happiness: number;
  is_baby: boolean;
  is_legendary: boolean;
  is_mythical: boolean;
  hatch_counter: number;
  has_gender_differences: boolean;
  forms_switchable: boolean;
  growth_rate: NamedAPIResource;
  pokedex_numbers: PokemonSpeciesDexEntry[];
  egg_groups: NamedAPIResource[];
  color: NamedAPIResource;
  shape: NamedAPIResource;
  evolves_from_species?: NamedAPIResource;
  evolution_chain: APIResource;
  habitat?: NamedAPIResource;
  generation: NamedAPIResource;
  names: Name[];
  pal_park_encounters: PalParkEncounterArea[];
  flavor_text_entries: FlavorText[];
  form_descriptions: Description[];
  genera: Genus[];
  varieties: PokemonSpeciesVariety[];
}

export interface PokemonSpeciesDexEntry {
  entry_number: number;
  pokedex: NamedAPIResource;
}

export interface PalParkEncounterArea {
  base_score: number;
  rate: number;
  area: NamedAPIResource;
}

export interface Name {
  name: string;
  language: NamedAPIResource;
}

export interface FlavorText {
  flavor_text: string;
  language: NamedAPIResource;
  version: NamedAPIResource;
}

export interface Description {
  description: string;
  language: NamedAPIResource;
}

export interface Genus {
  genus: string;
  language: NamedAPIResource;
}

export interface PokemonSpeciesVariety {
  is_default: boolean;
  pokemon: NamedAPIResource;
}

// Evolution Chain
export interface EvolutionChain {
  id: number;
  baby_trigger_item?: NamedAPIResource;
  chain: ChainLink;
}

export interface ChainLink {
  is_baby: boolean;
  species: NamedAPIResource;
  evolution_details: EvolutionDetail[];
  evolves_to: ChainLink[];
}

export interface EvolutionDetail {
  item?: NamedAPIResource;
  trigger: NamedAPIResource;
  gender?: number;
  held_item?: NamedAPIResource;
  known_move?: NamedAPIResource;
  known_move_type?: NamedAPIResource;
  location?: NamedAPIResource;
  min_level?: number;
  min_happiness?: number;
  min_beauty?: number;
  min_affection?: number;
  needs_overworld_rain?: boolean;
  party_species?: NamedAPIResource;
  party_type?: NamedAPIResource;
  relative_physical_stats?: number;
  time_of_day?: string;
  trade_species?: NamedAPIResource;
  turn_upside_down?: boolean;
}

// Type Effectiveness
export interface Type {
  id: number;
  name: string;
  damage_relations: TypeRelations;
  past_damage_relations: TypeRelationsPast[];
  game_indices: GenerationGameIndex[];
  generation: NamedAPIResource;
  move_damage_class?: NamedAPIResource;
  names: Name[];
  pokemon: TypePokemon[];
  moves: NamedAPIResource[];
}

export interface TypeRelations {
  no_damage_to: NamedAPIResource[];
  half_damage_to: NamedAPIResource[];
  double_damage_to: NamedAPIResource[];
  no_damage_from: NamedAPIResource[];
  half_damage_from: NamedAPIResource[];
  double_damage_from: NamedAPIResource[];
}

export interface TypeRelationsPast {
  generation: NamedAPIResource;
  damage_relations: TypeRelations;
}

export interface TypePokemon {
  slot: number;
  pokemon: NamedAPIResource;
}

export interface GenerationGameIndex {
  game_index: number;
  generation: NamedAPIResource;
}

// Paginated Results
export interface PokemonListResponse {
  count: number;
  next?: string;
  previous?: string;
  results: NamedAPIResource[];
}

// Custom types for our app
export interface PokemonCard {
  id: number;
  name: string;
  sprite: string;
  types: string[];
  height: number;
  weight: number;
  stats: {
    name: string;
    value: number;
  }[];
}

export interface PokemonFilter {
  types: string[];
  generations: number[];
  searchQuery: string;
  favorites: boolean;
  sortBy: 'id' | 'name' | 'height' | 'weight';
  sortOrder: 'asc' | 'desc';
}

export interface TypeEffectiveness {
  attacking: string;
  defending: string[];
  effectiveness: number; // 0, 0.25, 0.5, 1, 2, 4
}

// Generation data
export interface Generation {
  id: number;
  name: string;
  abilities: NamedAPIResource[];
  names: Name[];
  main_region: NamedAPIResource;
  moves: NamedAPIResource[];
  pokemon_species: NamedAPIResource[];
  types: NamedAPIResource[];
  version_groups: NamedAPIResource[];
}

// User favorites (stored in localStorage)
export interface UserFavorites {
  pokemonIds: number[];
  lastUpdated: string;
}

// Comparison data
export interface PokemonComparison {
  pokemon1: PokemonCard;
  pokemon2: PokemonCard;
  differences: {
    stats: {
      [key: string]: {
        pokemon1: number;
        pokemon2: number;
        difference: number;
        winner: 1 | 2;
      };
    };
    types: {
      pokemon1: string[];
      pokemon2: string[];
      unique1: string[];
      unique2: string[];
    };
  };
}

export type PokemonType =
  | 'normal' | 'fire' | 'water' | 'electric' | 'grass' | 'ice'
  | 'fighting' | 'poison' | 'ground' | 'flying' | 'psychic' | 'bug'
  | 'rock' | 'ghost' | 'dragon' | 'dark' | 'steel' | 'fairy';

export const POKEMON_TYPES: PokemonType[] = [
  'normal', 'fire', 'water', 'electric', 'grass', 'ice',
  'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
  'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
];

export const POKEMON_GENERATIONS = [
  { id: 1, name: 'Generation I', range: [1, 151] },
  { id: 2, name: 'Generation II', range: [152, 251] },
  { id: 3, name: 'Generation III', range: [252, 386] },
  { id: 4, name: 'Generation IV', range: [387, 493] },
  { id: 5, name: 'Generation V', range: [494, 649] },
  { id: 6, name: 'Generation VI', range: [650, 721] },
  { id: 7, name: 'Generation VII', range: [722, 809] },
  { id: 8, name: 'Generation VIII', range: [810, 905] },
  { id: 9, name: 'Generation IX', range: [906, 1025] },
];