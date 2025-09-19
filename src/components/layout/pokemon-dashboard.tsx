'use client';

import React, { Suspense } from 'react';
import { useInfinitePokemonList, useFeaturedPokemon } from '@/hooks/use-pokemon';
import { Header } from './header';
import { Sidebar } from './sidebar';
import { PokemonCard } from '@/components/pokemon/pokemon-card';
import { PokemonGrid } from '@/components/pokemon/pokemon-grid';
import { usePokemonContext } from '@/contexts/pokemon-context';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

function DashboardContent() {
  const { state } = usePokemonContext();

  // Fetch Pokemon data with infinite scroll
  const {
    data: infiniteData,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfinitePokemonList(20);

  // Fetch featured Pokemon
  const {
    data: featuredPokemon,
    isLoading: featuredLoading,
  } = useFeaturedPokemon();

  // Flatten the paginated data
  const allPokemon = React.useMemo(() => {
    if (!infiniteData?.pages) return [];

    const pokemonUrls = infiniteData.pages
      .flatMap(page => page.results)
      .map(pokemon => pokemon.url);

    // Extract IDs and create card data
    const pokemonIds = pokemonUrls.map(url => {
      const parts = url.split('/');
      return parseInt(parts[parts.length - 2]);
    });

    // This is a simplified version - in a real app, you'd fetch full Pokemon data
    return pokemonIds.map(id => ({
      id,
      name: `Pokemon ${id}`,
      sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`,
      types: ['normal'], // Placeholder
      height: 10,
      weight: 100,
      stats: [
        { name: 'HP', value: 45 },
        { name: 'Attack', value: 49 },
        { name: 'Defense', value: 49 },
        { name: 'Sp. Attack', value: 65 },
        { name: 'Sp. Defense', value: 65 },
        { name: 'Speed', value: 45 },
      ],
    }));
  }, [infiniteData]);

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div
        className={cn(
          'flex-1 flex flex-col transition-all duration-300',
          state.sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'
        )}
      >
        {/* Header */}
        <Header />

        {/* Main Content Area */}
        <main className="flex-1 container mx-auto px-4 py-6 space-y-8">
          {/* Featured Pokemon Section */}
          {featuredPokemon && !featuredLoading && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Featured Pokémon</h2>
                <div className="text-sm text-white/70">
                  Discover amazing Pokémon
                </div>
              </div>
              <PokemonCard
                pokemon={featuredPokemon}
                variant="featured"
                className="max-w-4xl mx-auto"
              />
            </section>
          )}

          {/* Loading state for featured Pokemon */}
          {featuredLoading && (
            <section className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Featured Pokémon</h2>
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center gap-3">
                  <Loader2 className="h-6 w-6 animate-spin text-white" />
                  <span className="text-white">Loading featured Pokémon...</span>
                </div>
              </div>
            </section>
          )}

          {/* Pokemon Grid Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">All Pokémon</h2>
              <div className="text-sm text-white/70">
                Browse the complete Pokédex
              </div>
            </div>

            <PokemonGrid
              pokemon={allPokemon}
              loading={isLoading}
              error={isError ? error?.message : undefined}
              hasNextPage={hasNextPage}
              onLoadMore={fetchNextPage}
              loadingMore={isFetchingNextPage}
            />
          </section>

          {/* Quick Stats Section */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
            <div className="pokemon-card p-6 text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {allPokemon.length}
              </div>
              <div className="text-white/70">Pokémon Loaded</div>
            </div>
            <div className="pokemon-card p-6 text-center">
              <div className="text-3xl font-bold pokeball-red mb-2">
                {state.favorites.length}
              </div>
              <div className="text-white/70">Favorites</div>
            </div>
            <div className="pokemon-card p-6 text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {state.filters.types.length + state.filters.generations.length}
              </div>
              <div className="text-white/70">Active Filters</div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

// Enhanced dashboard with better Pokemon data loading
function EnhancedDashboard() {
  const { state } = usePokemonContext();
  const [pokemonData, setPokemonData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Load initial Pokemon data
  React.useEffect(() => {
    const loadPokemonData = async () => {
      try {
        setLoading(true);

        // Load first 151 Pokemon (Generation 1) as sample data
        const pokemonPromises = Array.from({ length: 50 }, (_, i) => {
          const id = i + 1;
          return fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
            .then(res => res.json())
            .then(pokemon => ({
              id: pokemon.id,
              name: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
              sprite: pokemon.sprites.other?.['official-artwork']?.front_default ||
                      pokemon.sprites.front_default || '',
              types: pokemon.types.map((t: any) => t.type.name),
              height: pokemon.height,
              weight: pokemon.weight,
              stats: pokemon.stats.map((s: any) => ({
                name: s.stat.name === 'hp' ? 'HP' :
                      s.stat.name === 'special-attack' ? 'Sp. Attack' :
                      s.stat.name === 'special-defense' ? 'Sp. Defense' :
                      s.stat.name.charAt(0).toUpperCase() + s.stat.name.slice(1),
                value: s.base_stat
              }))
            }));
        });

        const pokemonResults = await Promise.all(pokemonPromises);
        setPokemonData(pokemonResults);
        setError(null);
      } catch (err) {
        console.error('Error loading Pokemon:', err);
        setError('Failed to load Pokemon data');
      } finally {
        setLoading(false);
      }
    };

    loadPokemonData();
  }, []);

  // Get featured Pokemon (random from loaded data)
  const featuredPokemon = React.useMemo(() => {
    if (pokemonData.length === 0) return null;

    // Featured Pokemon IDs (popular ones)
    const featuredIds = [1, 4, 7, 25, 150]; // Bulbasaur, Charmander, Squirtle, Pikachu, Mewtwo
    const availableFeatured = pokemonData.filter(p => featuredIds.includes(p.id));

    if (availableFeatured.length > 0) {
      return availableFeatured[Math.floor(Math.random() * availableFeatured.length)];
    }

    return pokemonData[Math.floor(Math.random() * pokemonData.length)];
  }, [pokemonData]);

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div
        className={cn(
          'flex-1 flex flex-col transition-all duration-300',
          state.sidebarOpen ? 'lg:ml-64' : 'lg:ml-0'
        )}
      >
        {/* Header */}
        <Header />

        {/* Main Content Area */}
        <main className="flex-1 container mx-auto px-4 py-6 space-y-8">
          {/* Featured Pokemon Section */}
          {featuredPokemon && (
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">Featured Pokémon</h2>
                <div className="text-sm text-white/70">
                  Discover amazing Pokémon
                </div>
              </div>
              <PokemonCard
                pokemon={featuredPokemon}
                variant="featured"
                className="max-w-4xl mx-auto"
              />
            </section>
          )}

          {/* Pokemon Grid Section */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white">All Pokémon</h2>
              <div className="text-sm text-white/70">
                Browse the complete Pokédex
              </div>
            </div>

            <PokemonGrid
              pokemon={pokemonData}
              loading={loading}
              error={error}
            />
          </section>

          {/* Quick Stats Section */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 py-8">
            <div className="pokemon-card p-6 text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {pokemonData.length}
              </div>
              <div className="text-white/70">Pokémon Loaded</div>
            </div>
            <div className="pokemon-card p-6 text-center">
              <div className="text-3xl font-bold pokeball-red mb-2">
                {state.favorites.length}
              </div>
              <div className="text-white/70">Favorites</div>
            </div>
            <div className="pokemon-card p-6 text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {state.filters.types.length + state.filters.generations.length}
              </div>
              <div className="text-white/70">Active Filters</div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export function PokemonDashboard() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
          <div className="flex items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
            <span className="text-white text-lg">Loading Pokédex...</span>
          </div>
        </div>
      }
    >
      <EnhancedDashboard />
    </Suspense>
  );
}