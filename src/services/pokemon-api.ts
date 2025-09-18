import {
  Pokemon,
  PokemonListResponse,
  PokemonSpecies,
  EvolutionChain,
  Type,
  PokemonCard
} from '@/types/pokemon';

const POKEMON_API_BASE = 'https://pokeapi.co/api/v2';

export class PokemonAPIService {

  // Cache for processed Pokemon data
  private static cache = new Map<string, any>();

  // Get a single Pokemon by ID or name
  static async getPokemon(identifier: string | number): Promise<Pokemon> {
    const cacheKey = `pokemon-${identifier}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const response = await fetch(`${POKEMON_API_BASE}/pokemon/${identifier}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch Pokemon ${identifier}: ${response.statusText}`);
    }

    const pokemon = await response.json();
    this.cache.set(cacheKey, pokemon);

    return pokemon;
  }

  // Get Pokemon species data (for evolution chains, descriptions, etc.)
  static async getPokemonSpecies(identifier: string | number): Promise<PokemonSpecies> {
    const cacheKey = `species-${identifier}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const response = await fetch(`${POKEMON_API_BASE}/pokemon-species/${identifier}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch Pokemon species ${identifier}: ${response.statusText}`);
    }

    const species = await response.json();
    this.cache.set(cacheKey, species);

    return species;
  }

  // Get evolution chain
  static async getEvolutionChain(url: string): Promise<EvolutionChain> {
    const cacheKey = `evolution-${url}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch evolution chain: ${response.statusText}`);
    }

    const evolutionChain = await response.json();
    this.cache.set(cacheKey, evolutionChain);

    return evolutionChain;
  }

  // Get type information
  static async getType(identifier: string | number): Promise<Type> {
    const cacheKey = `type-${identifier}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const response = await fetch(`${POKEMON_API_BASE}/type/${identifier}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch type ${identifier}: ${response.statusText}`);
    }

    const type = await response.json();
    this.cache.set(cacheKey, type);

    return type;
  }

  // Get paginated list of Pokemon
  static async getPokemonList(
    limit: number = 20,
    offset: number = 0
  ): Promise<PokemonListResponse> {
    const cacheKey = `pokemon-list-${limit}-${offset}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const response = await fetch(
      `${POKEMON_API_BASE}/pokemon?limit=${limit}&offset=${offset}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch Pokemon list: ${response.statusText}`);
    }

    const pokemonList = await response.json();
    this.cache.set(cacheKey, pokemonList);

    return pokemonList;
  }

  // Get Pokemon data formatted for cards
  static async getPokemonCard(identifier: string | number): Promise<PokemonCard> {
    const cacheKey = `pokemon-card-${identifier}`;

    if (this.cache.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const pokemon = await this.getPokemon(identifier);

    const card: PokemonCard = {
      id: pokemon.id,
      name: this.capitalizeFirst(pokemon.name),
      sprite: pokemon.sprites.other?.['official-artwork']?.front_default
        || pokemon.sprites.front_default
        || '',
      types: pokemon.types.map(type => type.type.name),
      height: pokemon.height,
      weight: pokemon.weight,
      stats: pokemon.stats.map(stat => ({
        name: this.formatStatName(stat.stat.name),
        value: stat.base_stat
      }))
    };

    this.cache.set(cacheKey, card);
    return card;
  }

  // Get multiple Pokemon cards in parallel
  static async getPokemonCards(identifiers: (string | number)[]): Promise<PokemonCard[]> {
    const promises = identifiers.map(id => this.getPokemonCard(id));
    return Promise.all(promises);
  }

  // Search Pokemon by name (fuzzy search)
  static async searchPokemon(query: string, limit: number = 20): Promise<PokemonCard[]> {
    // For a more comprehensive search, we'll first get a larger list
    // In a real app, you might use a dedicated search service
    const { results } = await this.getPokemonList(1000, 0);

    const filtered = results
      .filter(pokemon =>
        pokemon.name.toLowerCase().includes(query.toLowerCase())
      )
      .slice(0, limit);

    return this.getPokemonCards(filtered.map(p => this.extractIdFromUrl(p.url)));
  }

  // Get Pokemon by type
  static async getPokemonByType(typeName: string): Promise<PokemonCard[]> {
    const type = await this.getType(typeName);
    const pokemonIds = type.pokemon
      .slice(0, 50) // Limit to first 50 for performance
      .map(p => this.extractIdFromUrl(p.pokemon.url));

    return this.getPokemonCards(pokemonIds);
  }

  // Get featured Pokemon (random selection of popular Pokemon)
  static async getFeaturedPokemon(): Promise<PokemonCard> {
    // Popular Pokemon IDs for featured display
    const featuredIds = [1, 4, 7, 25, 39, 52, 104, 131, 143, 150, 151];
    const randomId = featuredIds[Math.floor(Math.random() * featuredIds.length)];

    return this.getPokemonCard(randomId);
  }

  // Get complete evolution chain with Pokemon data
  static async getCompleteEvolutionChain(pokemonId: number): Promise<PokemonCard[]> {
    try {
      const species = await this.getPokemonSpecies(pokemonId);
      const evolutionChain = await this.getEvolutionChain(species.evolution_chain.url);

      const evolutionIds: number[] = [];

      // Recursively extract all Pokemon IDs from the evolution chain
      const extractIds = (chain: any) => {
        const id = this.extractIdFromUrl(chain.species.url);
        evolutionIds.push(id);

        chain.evolves_to.forEach((evolution: any) => {
          extractIds(evolution);
        });
      };

      extractIds(evolutionChain.chain);

      return this.getPokemonCards(evolutionIds);
    } catch (error) {
      console.error('Error fetching evolution chain:', error);
      return [];
    }
  }

  // Utility: Extract Pokemon ID from API URL
  private static extractIdFromUrl(url: string): number {
    const parts = url.split('/');
    return parseInt(parts[parts.length - 2]);
  }

  // Utility: Capitalize first letter
  private static capitalizeFirst(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  // Utility: Format stat names for display
  private static formatStatName(statName: string): string {
    const statMap: { [key: string]: string } = {
      'hp': 'HP',
      'attack': 'Attack',
      'defense': 'Defense',
      'special-attack': 'Sp. Attack',
      'special-defense': 'Sp. Defense',
      'speed': 'Speed'
    };

    return statMap[statName] || this.capitalizeFirst(statName);
  }

  // Utility: Clear cache (useful for development)
  static clearCache(): void {
    this.cache.clear();
  }

  // Utility: Get cache size
  static getCacheSize(): number {
    return this.cache.size;
  }
}

// React Query keys for consistent caching
export const pokemonQueryKeys = {
  all: ['pokemon'] as const,
  lists: () => [...pokemonQueryKeys.all, 'list'] as const,
  list: (limit: number, offset: number) =>
    [...pokemonQueryKeys.lists(), { limit, offset }] as const,
  details: () => [...pokemonQueryKeys.all, 'detail'] as const,
  detail: (id: string | number) =>
    [...pokemonQueryKeys.details(), id] as const,
  search: (query: string) =>
    [...pokemonQueryKeys.all, 'search', query] as const,
  type: (typeName: string) =>
    [...pokemonQueryKeys.all, 'type', typeName] as const,
  evolution: (id: number) =>
    [...pokemonQueryKeys.all, 'evolution', id] as const,
  featured: () => [...pokemonQueryKeys.all, 'featured'] as const,
};

// Type effectiveness data
export const TYPE_EFFECTIVENESS = {
  normal: {
    weakTo: ['fighting'],
    resistantTo: [],
    immuneTo: ['ghost'],
    strongAgainst: [],
    weakAgainst: ['rock', 'steel'],
    noEffect: ['ghost']
  },
  fire: {
    weakTo: ['ground', 'rock', 'water'],
    resistantTo: ['bug', 'steel', 'fire', 'grass', 'ice', 'fairy'],
    immuneTo: [],
    strongAgainst: ['bug', 'steel', 'grass', 'ice'],
    weakAgainst: ['rock', 'fire', 'water', 'dragon'],
    noEffect: []
  },
  water: {
    weakTo: ['grass', 'electric'],
    resistantTo: ['steel', 'fire', 'water', 'ice'],
    immuneTo: [],
    strongAgainst: ['ground', 'rock', 'fire'],
    weakAgainst: ['water', 'grass', 'dragon'],
    noEffect: []
  },
  electric: {
    weakTo: ['ground'],
    resistantTo: ['flying', 'steel', 'electric'],
    immuneTo: [],
    strongAgainst: ['flying', 'water'],
    weakAgainst: ['grass', 'electric', 'dragon'],
    noEffect: ['ground']
  },
  grass: {
    weakTo: ['flying', 'poison', 'bug', 'fire', 'ice'],
    resistantTo: ['ground', 'water', 'grass', 'electric'],
    immuneTo: [],
    strongAgainst: ['ground', 'rock', 'water'],
    weakAgainst: ['flying', 'poison', 'bug', 'steel', 'fire', 'grass', 'dragon'],
    noEffect: []
  },
  ice: {
    weakTo: ['fighting', 'rock', 'steel', 'fire'],
    resistantTo: ['ice'],
    immuneTo: [],
    strongAgainst: ['flying', 'ground', 'grass', 'dragon'],
    weakAgainst: ['steel', 'fire', 'water', 'ice'],
    noEffect: []
  },
  fighting: {
    weakTo: ['flying', 'psychic', 'fairy'],
    resistantTo: ['rock', 'bug', 'dark'],
    immuneTo: [],
    strongAgainst: ['normal', 'rock', 'steel', 'ice', 'dark'],
    weakAgainst: ['flying', 'poison', 'psychic', 'bug', 'fairy'],
    noEffect: ['ghost']
  },
  poison: {
    weakTo: ['ground', 'psychic'],
    resistantTo: ['fighting', 'poison', 'bug', 'grass', 'fairy'],
    immuneTo: [],
    strongAgainst: ['grass', 'fairy'],
    weakAgainst: ['poison', 'ground', 'rock', 'ghost'],
    noEffect: ['steel']
  },
  ground: {
    weakTo: ['water', 'grass', 'ice'],
    resistantTo: ['poison', 'rock'],
    immuneTo: ['electric'],
    strongAgainst: ['poison', 'electric', 'steel', 'fire', 'rock'],
    weakAgainst: ['bug', 'grass'],
    noEffect: ['flying']
  },
  flying: {
    weakTo: ['rock', 'electric', 'ice'],
    resistantTo: ['fighting', 'ground', 'bug', 'grass'],
    immuneTo: [],
    strongAgainst: ['fighting', 'bug', 'grass'],
    weakAgainst: ['rock', 'steel', 'electric'],
    noEffect: []
  },
  psychic: {
    weakTo: ['bug', 'ghost', 'dark'],
    resistantTo: ['fighting', 'psychic'],
    immuneTo: [],
    strongAgainst: ['fighting', 'poison'],
    weakAgainst: ['steel', 'psychic'],
    noEffect: ['dark']
  },
  bug: {
    weakTo: ['flying', 'rock', 'fire'],
    resistantTo: ['fighting', 'ground', 'grass'],
    immuneTo: [],
    strongAgainst: ['grass', 'psychic', 'dark'],
    weakAgainst: ['fighting', 'flying', 'poison', 'ghost', 'steel', 'fire', 'fairy'],
    noEffect: []
  },
  rock: {
    weakTo: ['fighting', 'ground', 'steel', 'water', 'grass'],
    resistantTo: ['normal', 'flying', 'poison', 'fire'],
    immuneTo: [],
    strongAgainst: ['flying', 'bug', 'fire', 'ice'],
    weakAgainst: ['fighting', 'ground', 'steel'],
    noEffect: []
  },
  ghost: {
    weakTo: ['ghost', 'dark'],
    resistantTo: ['poison', 'bug'],
    immuneTo: ['normal', 'fighting'],
    strongAgainst: ['ghost', 'psychic'],
    weakAgainst: ['dark'],
    noEffect: ['normal']
  },
  dragon: {
    weakTo: ['ice', 'dragon', 'fairy'],
    resistantTo: ['fire', 'water', 'electric', 'grass'],
    immuneTo: [],
    strongAgainst: ['dragon'],
    weakAgainst: ['steel'],
    noEffect: ['fairy']
  },
  dark: {
    weakTo: ['fighting', 'bug', 'fairy'],
    resistantTo: ['ghost', 'dark'],
    immuneTo: ['psychic'],
    strongAgainst: ['ghost', 'psychic'],
    weakAgainst: ['fighting', 'dark', 'fairy'],
    noEffect: []
  },
  steel: {
    weakTo: ['fighting', 'ground', 'fire'],
    resistantTo: ['normal', 'flying', 'rock', 'bug', 'steel', 'grass', 'psychic', 'ice', 'dragon', 'fairy'],
    immuneTo: ['poison'],
    strongAgainst: ['rock', 'ice', 'fairy'],
    weakAgainst: ['steel', 'fire', 'water', 'electric'],
    noEffect: []
  },
  fairy: {
    weakTo: ['poison', 'steel'],
    resistantTo: ['fighting', 'bug', 'dark'],
    immuneTo: ['dragon'],
    strongAgainst: ['fighting', 'dragon', 'dark'],
    weakAgainst: ['poison', 'steel', 'fire'],
    noEffect: []
  }
};