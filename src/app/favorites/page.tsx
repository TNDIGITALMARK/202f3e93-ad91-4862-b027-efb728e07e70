'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PokemonGrid } from '@/components/pokemon/pokemon-grid';
import { usePokemonCards } from '@/hooks/use-pokemon';
import { usePokemonContext } from '@/contexts/pokemon-context';

export default function FavoritesPage() {
  const { state } = usePokemonContext();
  const { data: favoritePokemon = [], isLoading } = usePokemonCards(
    state.favorites,
    { enabled: state.favorites.length > 0 }
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="icon" asChild className="border-white/20 text-white hover:bg-white/10">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Heart className="h-8 w-8 text-red-500 fill-current" />
              My Favorites
            </h1>
            <p className="text-white/70">Your favorite Pokémon collection</p>
          </div>
        </div>

        {/* Favorites Grid */}
        <PokemonGrid
          pokemon={favoritePokemon}
          loading={isLoading}
          error={state.favorites.length === 0 ? 'No favorites yet' : undefined}
        />

        {state.favorites.length === 0 && (
          <div className="text-center py-12">
            <Heart className="h-16 w-16 text-white/30 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">No favorites yet</h2>
            <p className="text-white/70 mb-6">
              Start adding Pokémon to your favorites by clicking the heart icon on any Pokémon card.
            </p>
            <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Link href="/">Browse Pokémon</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}