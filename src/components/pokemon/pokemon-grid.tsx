'use client';

import React from 'react';
import { Loader2, Search, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PokemonCard } from './pokemon-card';
import { PokemonCard as PokemonCardType } from '@/types/pokemon';
import { usePokemonContext } from '@/contexts/pokemon-context';
import { cn } from '@/lib/utils';

interface PokemonGridProps {
  pokemon: PokemonCardType[];
  loading?: boolean;
  error?: string;
  hasNextPage?: boolean;
  onLoadMore?: () => void;
  loadingMore?: boolean;
  className?: string;
}

export function PokemonGrid({
  pokemon,
  loading,
  error,
  hasNextPage,
  onLoadMore,
  loadingMore,
  className
}: PokemonGridProps) {
  const { state } = usePokemonContext();

  // Filter pokemon based on current filters
  const filteredPokemon = React.useMemo(() => {
    let filtered = [...pokemon];

    // Apply type filters
    if (state.filters.types.length > 0) {
      filtered = filtered.filter(p =>
        p.types.some(type => state.filters.types.includes(type))
      );
    }

    // Apply search filter
    if (state.filters.searchQuery) {
      const query = state.filters.searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.id.toString().includes(query) ||
        p.types.some(type => type.toLowerCase().includes(query))
      );
    }

    // Apply favorites filter
    if (state.filters.favorites) {
      filtered = filtered.filter(p => state.favorites.includes(p.id));
    }

    // Apply generation filter
    if (state.filters.generations.length > 0) {
      filtered = filtered.filter(p => {
        // Check which generation the pokemon belongs to
        for (const gen of state.filters.generations) {
          const ranges = {
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
          const range = ranges[gen as keyof typeof ranges];
          if (range && p.id >= range[0] && p.id <= range[1]) {
            return true;
          }
        }
        return false;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      const { sortBy, sortOrder } = state.filters;
      let comparison = 0;

      switch (sortBy) {
        case 'id':
          comparison = a.id - b.id;
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'height':
          comparison = a.height - b.height;
          break;
        case 'weight':
          comparison = a.weight - b.weight;
          break;
        default:
          comparison = a.id - b.id;
      }

      return sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [pokemon, state.filters, state.favorites]);

  // Loading state
  if (loading && pokemon.length === 0) {
    return (
      <div className={cn('flex items-center justify-center py-12', className)}>
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <p className="text-muted-foreground">Loading Pokémon...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={cn('flex items-center justify-center py-12', className)}>
        <div className="flex flex-col items-center gap-4 text-center">
          <AlertCircle className="h-8 w-8 text-destructive" />
          <div>
            <h3 className="font-semibold text-foreground mb-2">Error loading Pokémon</h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Empty state
  if (filteredPokemon.length === 0 && !loading) {
    const hasFilters = (
      state.filters.types.length > 0 ||
      state.filters.generations.length > 0 ||
      state.filters.searchQuery ||
      state.filters.favorites
    );

    return (
      <div className={cn('flex items-center justify-center py-12', className)}>
        <div className="flex flex-col items-center gap-4 text-center max-w-md">
          <Search className="h-8 w-8 text-muted-foreground" />
          <div>
            <h3 className="font-semibold text-foreground mb-2">
              {hasFilters ? 'No Pokémon match your filters' : 'No Pokémon found'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {hasFilters
                ? 'Try adjusting your search criteria or clearing some filters.'
                : 'There seems to be an issue loading the Pokémon data.'}
            </p>
            {hasFilters && (
              <Button
                onClick={() => {
                  // Clear filters logic would go here
                  console.log('Clear filters');
                }}
                variant="outline"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const gridCols = state.viewMode === 'grid'
    ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6'
    : 'grid-cols-1';

  return (
    <div className={cn('space-y-6', className)}>
      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredPokemon.length} of {pokemon.length} Pokémon
        </p>
        {state.viewMode === 'grid' && (
          <p className="text-xs text-muted-foreground">
            Grid view
          </p>
        )}
        {state.viewMode === 'list' && (
          <p className="text-xs text-muted-foreground">
            List view
          </p>
        )}
      </div>

      {/* Pokemon Grid */}
      <div className={cn('grid gap-4', gridCols)}>
        {filteredPokemon.map((pokemon) => (
          <PokemonCard
            key={pokemon.id}
            pokemon={pokemon}
            variant={state.viewMode === 'list' ? 'compact' : 'default'}
            showStats={state.viewMode === 'grid'}
          />
        ))}
      </div>

      {/* Load More Button */}
      {hasNextPage && onLoadMore && (
        <div className="flex justify-center py-6">
          <Button
            onClick={onLoadMore}
            disabled={loadingMore}
            variant="outline"
            size="lg"
            className="min-w-32"
          >
            {loadingMore ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Loading...
              </>
            ) : (
              'Load More'
            )}
          </Button>
        </div>
      )}

      {/* Loading More Indicator */}
      {loadingMore && (
        <div className="flex justify-center py-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading more Pokémon...
          </div>
        </div>
      )}
    </div>
  );
}