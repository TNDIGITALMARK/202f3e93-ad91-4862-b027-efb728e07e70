'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Heart, BarChart3, Zap, Shield, Swords, Star, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { usePokemonCard, useEvolutionChain } from '@/hooks/use-pokemon';
import { usePokemonContext } from '@/contexts/pokemon-context';
import { Loader2 } from 'lucide-react';
import { PokemonCard } from '@/components/pokemon/pokemon-card';
import { cn } from '@/lib/utils';

export default function PokemonDetailPage() {
  const params = useParams();
  const pokemonId = parseInt(params.id as string);

  const {
    toggleFavorite,
    selectPokemon,
    isPokemonFavorite,
    isPokemonSelected,
    state
  } = usePokemonContext();

  const { data: pokemon, isLoading, error } = usePokemonCard(pokemonId);
  const { data: evolutionChain, isLoading: evolutionLoading } = useEvolutionChain(pokemonId);

  const isFavorite = isPokemonFavorite(pokemonId);
  const isSelected = isPokemonSelected(pokemonId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
          <span className="text-white text-lg">Loading Pokémon...</span>
        </div>
      </div>
    );
  }

  if (error || !pokemon) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Pokémon not found</h1>
          <Button asChild variant="outline">
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const getStatIcon = (statName: string) => {
    switch (statName.toLowerCase()) {
      case 'hp':
        return <Heart className="h-4 w-4 text-red-500" />;
      case 'attack':
        return <Swords className="h-4 w-4 text-orange-500" />;
      case 'defense':
        return <Shield className="h-4 w-4 text-blue-500" />;
      case 'sp. attack':
        return <Zap className="h-4 w-4 text-purple-500" />;
      case 'sp. defense':
        return <Shield className="h-4 w-4 text-green-500" />;
      case 'speed':
        return <Star className="h-4 w-4 text-yellow-500" />;
      default:
        return <TrendingUp className="h-4 w-4" />;
    }
  };

  const getStatColor = (value: number) => {
    if (value >= 120) return 'bg-green-500';
    if (value >= 100) return 'bg-lime-500';
    if (value >= 80) return 'bg-yellow-500';
    if (value >= 60) return 'bg-orange-500';
    if (value >= 40) return 'bg-red-500';
    return 'bg-gray-500';
  };

  const totalStats = pokemon.stats.reduce((sum, stat) => sum + stat.value, 0);
  const avgStat = Math.round(totalStats / pokemon.stats.length);

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
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                #{pokemon.id.toString().padStart(3, '0')}
              </Badge>
              <h1 className="text-3xl font-bold text-white">{pokemon.name}</h1>
            </div>
            <div className="flex gap-2 mt-2">
              {pokemon.types.map((type) => (
                <Badge
                  key={type}
                  className={cn('text-sm px-3 py-1 text-white capitalize', `type-${type}`)}
                >
                  {type}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={isFavorite ? 'default' : 'outline'}
              size="icon"
              onClick={() => toggleFavorite(pokemonId)}
              className={cn(
                'border-white/20',
                isFavorite ? 'pokeball-bg hover:bg-red-600' : 'text-white hover:bg-white/10'
              )}
            >
              <Heart className={cn('h-4 w-4', isFavorite && 'fill-current')} />
            </Button>
            {state.comparisonMode && (
              <Button
                variant={isSelected ? 'default' : 'outline'}
                size="icon"
                onClick={() => selectPokemon(pokemonId)}
                className={cn(
                  'border-white/20',
                  isSelected ? 'pokeball-bg hover:bg-red-600' : 'text-white hover:bg-white/10'
                )}
              >
                <BarChart3 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Pokemon Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Pokemon Image */}
            <Card className="pokemon-card overflow-hidden">
              <CardContent className="p-6">
                <div className="relative w-full h-64 mb-4">
                  {pokemon.sprite ? (
                    <Image
                      src={pokemon.sprite}
                      alt={pokemon.name}
                      fill
                      className="object-contain"
                      sizes="400px"
                      priority
                    />
                  ) : (
                    <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
                      <span className="text-6xl">?</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Basic Info */}
            <Card className="pokemon-card">
              <CardHeader>
                <CardTitle className="text-white">Basic Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-muted-foreground">Height</div>
                    <div className="font-semibold text-white">
                      {(pokemon.height / 10).toFixed(1)} m
                    </div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Weight</div>
                    <div className="font-semibold text-white">
                      {(pokemon.weight / 10).toFixed(1)} kg
                    </div>
                  </div>
                </div>
                <Separator className="bg-border/50" />
                <div>
                  <div className="text-muted-foreground mb-2">Types</div>
                  <div className="flex gap-2">
                    {pokemon.types.map((type) => (
                      <Badge
                        key={type}
                        className={cn('text-white capitalize', `type-${type}`)}
                      >
                        {type}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Info */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="stats" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3 lg:grid-cols-4">
                <TabsTrigger value="stats">Stats</TabsTrigger>
                <TabsTrigger value="evolution">Evolution</TabsTrigger>
                <TabsTrigger value="moves">Moves</TabsTrigger>
                <TabsTrigger value="abilities" className="hidden lg:block">Abilities</TabsTrigger>
              </TabsList>

              {/* Stats Tab */}
              <TabsContent value="stats" className="space-y-6">
                <Card className="pokemon-card">
                  <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Base Stats
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {pokemon.stats.map((stat) => (
                        <div key={stat.name} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {getStatIcon(stat.name)}
                              <span className="text-sm text-white font-medium">
                                {stat.name}
                              </span>
                            </div>
                            <span className="text-sm font-bold text-white">
                              {stat.value}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={(stat.value / 255) * 100} className="flex-1" />
                            <div className="text-xs text-muted-foreground w-12 text-right">
                              {Math.round((stat.value / 255) * 100)}%
                            </div>
                          </div>
                        </div>
                      ))}

                      <Separator className="bg-border/50 my-4" />

                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">{totalStats}</div>
                          <div className="text-muted-foreground">Total</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-white">{avgStat}</div>
                          <div className="text-muted-foreground">Average</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Stat Distribution Chart */}
                <Card className="pokemon-card">
                  <CardHeader>
                    <CardTitle className="text-white">Stat Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      {pokemon.stats.slice(0, 6).map((stat) => (
                        <div key={stat.name} className="space-y-2">
                          <div className="text-xs text-muted-foreground">{stat.name}</div>
                          <div className="relative h-20 w-6 mx-auto bg-muted rounded-full overflow-hidden">
                            <div
                              className={cn('absolute bottom-0 w-full rounded-full', getStatColor(stat.value))}
                              style={{ height: `${(stat.value / 255) * 100}%` }}
                            />
                          </div>
                          <div className="text-xs font-medium text-white">{stat.value}</div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Evolution Tab */}
              <TabsContent value="evolution" className="space-y-6">
                <Card className="pokemon-card">
                  <CardHeader>
                    <CardTitle className="text-white">Evolution Chain</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {evolutionLoading ? (
                      <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-white" />
                        <span className="ml-2 text-white">Loading evolution chain...</span>
                      </div>
                    ) : evolutionChain && evolutionChain.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {evolutionChain.map((pokemon) => (
                          <PokemonCard
                            key={pokemon.id}
                            pokemon={pokemon}
                            variant="compact"
                            showStats={false}
                          />
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        This Pokémon does not evolve.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Moves Tab */}
              <TabsContent value="moves">
                <Card className="pokemon-card">
                  <CardHeader>
                    <CardTitle className="text-white">Moves</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      Move information coming soon...
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Abilities Tab */}
              <TabsContent value="abilities">
                <Card className="pokemon-card">
                  <CardHeader>
                    <CardTitle className="text-white">Abilities</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      Ability information coming soon...
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}