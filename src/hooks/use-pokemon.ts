'use client';

import { useQuery, useInfiniteQuery, UseQueryOptions } from '@tanstack/react-query';
import { PokemonAPIService, pokemonQueryKeys } from '@/services/pokemon-api';
import { Pokemon, PokemonCard, PokemonListResponse, EvolutionChain } from '@/types/pokemon';

// Hook for fetching a single Pokemon
export function usePokemon(
  identifier: string | number,
  options?: UseQueryOptions<Pokemon, Error>
) {
  return useQuery({
    queryKey: pokemonQueryKeys.detail(identifier),
    queryFn: () => PokemonAPIService.getPokemon(identifier),
    enabled: !!identifier,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes (formerly cacheTime)
    ...options,
  });
}

// Hook for fetching a Pokemon card (formatted data)
export function usePokemonCard(
  identifier: string | number,
  options?: UseQueryOptions<PokemonCard, Error>
) {
  return useQuery({
    queryKey: [...pokemonQueryKeys.detail(identifier), 'card'],
    queryFn: () => PokemonAPIService.getPokemonCard(identifier),
    enabled: !!identifier,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    ...options,
  });
}

// Hook for fetching multiple Pokemon cards
export function usePokemonCards(
  identifiers: (string | number)[],
  options?: UseQueryOptions<PokemonCard[], Error>
) {
  return useQuery({
    queryKey: [...pokemonQueryKeys.all, 'cards', identifiers],
    queryFn: () => PokemonAPIService.getPokemonCards(identifiers),
    enabled: identifiers.length > 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    ...options,
  });
}

// Hook for fetching paginated Pokemon list
export function usePokemonList(
  limit: number = 20,
  offset: number = 0,
  options?: UseQueryOptions<PokemonListResponse, Error>
) {
  return useQuery({
    queryKey: pokemonQueryKeys.list(limit, offset),
    queryFn: () => PokemonAPIService.getPokemonList(limit, offset),
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
    ...options,
  });
}

// Hook for infinite scroll pagination
export function useInfinitePokemonList(limit: number = 20) {
  return useInfiniteQuery({
    queryKey: [...pokemonQueryKeys.lists(), 'infinite'],
    queryFn: ({ pageParam = 0 }) =>
      PokemonAPIService.getPokemonList(limit, pageParam),
    getNextPageParam: (lastPage, allPages) => {
      const nextOffset = allPages.length * limit;
      return nextOffset < lastPage.count ? nextOffset : undefined;
    },
    initialPageParam: 0,
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
  });
}

// Hook for searching Pokemon
export function useSearchPokemon(
  query: string,
  limit: number = 20,
  options?: UseQueryOptions<PokemonCard[], Error>
) {
  return useQuery({
    queryKey: pokemonQueryKeys.search(query),
    queryFn: () => PokemonAPIService.searchPokemon(query, limit),
    enabled: query.length >= 2, // Only search with 2+ characters
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes
    ...options,
  });
}

// Hook for fetching Pokemon by type
export function usePokemonByType(
  typeName: string,
  options?: UseQueryOptions<PokemonCard[], Error>
) {
  return useQuery({
    queryKey: pokemonQueryKeys.type(typeName),
    queryFn: () => PokemonAPIService.getPokemonByType(typeName),
    enabled: !!typeName,
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
    ...options,
  });
}

// Hook for fetching featured Pokemon
export function useFeaturedPokemon(options?: UseQueryOptions<PokemonCard, Error>) {
  return useQuery({
    queryKey: pokemonQueryKeys.featured(),
    queryFn: () => PokemonAPIService.getFeaturedPokemon(),
    staleTime: 1000 * 60 * 15, // 15 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
    refetchOnWindowFocus: false, // Don't refetch on focus for featured Pokemon
    ...options,
  });
}

// Hook for fetching evolution chain
export function useEvolutionChain(
  pokemonId: number,
  options?: UseQueryOptions<PokemonCard[], Error>
) {
  return useQuery({
    queryKey: pokemonQueryKeys.evolution(pokemonId),
    queryFn: () => PokemonAPIService.getCompleteEvolutionChain(pokemonId),
    enabled: !!pokemonId,
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
    ...options,
  });
}

// Hook for fetching multiple Pokemon by generation
export function usePokemonByGeneration(
  generation: number,
  options?: UseQueryOptions<PokemonCard[], Error>
) {
  // Generation ranges from pokemon.ts
  const generationRanges = {
    1: [1, 151],
    2: [152, 251],
    3: [252, 386],
    4: [387, 493],
    5: [494, 649],
    6: [650, 721],
    7: [722, 809],
    8: [810, 905],
    9: [906, 1025],
  };

  const range = generationRanges[generation as keyof typeof generationRanges];

  return useQuery({
    queryKey: [...pokemonQueryKeys.all, 'generation', generation],
    queryFn: async () => {
      if (!range) return [];
      const [start, end] = range;
      const ids = Array.from({ length: end - start + 1 }, (_, i) => start + i);
      // Limit to first 50 for performance
      return PokemonAPIService.getPokemonCards(ids.slice(0, 50));
    },
    enabled: !!range,
    staleTime: 1000 * 60 * 15, // 15 minutes
    gcTime: 1000 * 60 * 60, // 1 hour
    ...options,
  });
}

// Hook for pre-fetching related Pokemon data
export function usePrefetchPokemon() {
  // This can be used to pre-fetch commonly accessed Pokemon
  // Implementation depends on your specific needs
  return {
    prefetchFeatured: () => {
      // Implement pre-fetching logic
    },
    prefetchPopular: () => {
      // Implement pre-fetching logic
    },
  };
}

// Hook for managing favorites with local storage
export function useFavorites() {
  const getFavorites = (): number[] => {
    if (typeof window === 'undefined') return [];
    const favorites = localStorage.getItem('pokemon-favorites');
    return favorites ? JSON.parse(favorites) : [];
  };

  const addToFavorites = (pokemonId: number) => {
    const favorites = getFavorites();
    if (!favorites.includes(pokemonId)) {
      const newFavorites = [...favorites, pokemonId];
      localStorage.setItem('pokemon-favorites', JSON.stringify(newFavorites));
    }
  };

  const removeFromFavorites = (pokemonId: number) => {
    const favorites = getFavorites();
    const newFavorites = favorites.filter(id => id !== pokemonId);
    localStorage.setItem('pokemon-favorites', JSON.stringify(newFavorites));
  };

  const isFavorite = (pokemonId: number): boolean => {
    return getFavorites().includes(pokemonId);
  };

  const toggleFavorite = (pokemonId: number) => {
    if (isFavorite(pokemonId)) {
      removeFromFavorites(pokemonId);
    } else {
      addToFavorites(pokemonId);
    }
  };

  return {
    favorites: getFavorites(),
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
  };
}