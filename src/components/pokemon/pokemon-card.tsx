'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, BarChart3, Zap, Shield, Swords, Star, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { usePokemonContext } from '@/contexts/pokemon-context';
import { PokemonCard as PokemonCardType } from '@/types/pokemon';
import { cn } from '@/lib/utils';

interface PokemonCardProps {
  pokemon: PokemonCardType;
  variant?: 'default' | 'compact' | 'featured';
  showStats?: boolean;
  className?: string;
}

export function PokemonCard({
  pokemon,
  variant = 'default',
  showStats = true,
  className
}: PokemonCardProps) {
  const {
    state,
    toggleFavorite,
    selectPokemon,
    deselectPokemon,
    isPokemonSelected,
    isPokemonFavorite,
  } = usePokemonContext();

  const isFavorite = isPokemonFavorite(pokemon.id);
  const isSelected = isPokemonSelected(pokemon.id);
  const isComparisonMode = state.comparisonMode;

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavorite(pokemon.id);
  };

  const handleSelectClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isSelected) {
      deselectPokemon(pokemon.id);
    } else {
      selectPokemon(pokemon.id);
    }
  };

  const getStatIcon = (statName: string) => {
    switch (statName.toLowerCase()) {
      case 'hp':
        return <Heart className="h-3 w-3" />;
      case 'attack':
        return <Swords className="h-3 w-3" />;
      case 'defense':
        return <Shield className="h-3 w-3" />;
      case 'sp. attack':
        return <Zap className="h-3 w-3" />;
      case 'sp. defense':
        return <Shield className="h-3 w-3" />;
      case 'speed':
        return <Star className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getStatColor = (value: number) => {
    if (value >= 100) return 'bg-green-500';
    if (value >= 80) return 'bg-yellow-500';
    if (value >= 60) return 'bg-orange-500';
    return 'bg-red-500';
  };

  if (variant === 'compact') {
    return (
      <Card className={cn('pokemon-card group cursor-pointer', className)}>
        <Link href={`/pokemon/${pokemon.id}`}>
          <CardContent className="p-3">
            <div className="flex items-center gap-3">
              {/* Pokemon Image */}
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 relative">
                  {pokemon.sprite ? (
                    <Image
                      src={pokemon.sprite}
                      alt={pokemon.name}
                      fill
                      className="object-contain"
                      sizes="48px"
                    />
                  ) : (
                    <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
                      <span className="text-2xl">?</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Pokemon Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-muted-foreground">#{pokemon.id.toString().padStart(3, '0')}</span>
                  <h3 className="font-semibold text-sm truncate text-foreground">{pokemon.name}</h3>
                </div>
                <div className="flex gap-1">
                  {pokemon.types.map((type) => (
                    <Badge
                      key={type}
                      className={cn('text-xs px-2 py-0 h-5 text-white', `type-${type}`)}
                    >
                      {type}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                {isComparisonMode && (
                  <Button
                    variant={isSelected ? 'default' : 'outline'}
                    size="icon"
                    onClick={handleSelectClick}
                    className={cn(
                      'h-8 w-8',
                      isSelected && 'pokeball-bg hover:bg-red-600'
                    )}
                  >
                    <BarChart3 className="h-3 w-3" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleFavoriteClick}
                  className={cn(
                    'h-8 w-8',
                    isFavorite ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-red-500'
                  )}
                >
                  <Heart className={cn('h-3 w-3', isFavorite && 'fill-current')} />
                </Button>
              </div>
            </div>
          </CardContent>
        </Link>
      </Card>
    );
  }

  if (variant === 'featured') {
    return (
      <Card className={cn('pokemon-card group cursor-pointer overflow-hidden', className)}>
        <Link href={`/pokemon/${pokemon.id}`}>
          <div className="relative">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-600/20" />

            <CardContent className="relative p-6">
              <div className="flex flex-col lg:flex-row items-center gap-6">
                {/* Pokemon Image */}
                <div className="relative flex-shrink-0">
                  <div className="w-32 h-32 lg:w-40 lg:h-40 relative">
                    {pokemon.sprite ? (
                      <Image
                        src={pokemon.sprite}
                        alt={pokemon.name}
                        fill
                        className="object-contain drop-shadow-lg"
                        sizes="(max-width: 1024px) 128px, 160px"
                        priority
                      />
                    ) : (
                      <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
                        <span className="text-6xl">?</span>
                      </div>
                    )}
                  </div>

                  {/* Pokemon ID Badge */}
                  <Badge className="absolute -top-2 -left-2 pokeball-bg text-white">
                    #{pokemon.id.toString().padStart(3, '0')}
                  </Badge>
                </div>

                {/* Pokemon Details */}
                <div className="flex-1 text-center lg:text-left">
                  <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                    {pokemon.name}
                  </h2>

                  {/* Types */}
                  <div className="flex gap-2 justify-center lg:justify-start mb-4">
                    {pokemon.types.map((type) => (
                      <Badge
                        key={type}
                        className={cn('text-sm px-3 py-1 text-white capitalize', `type-${type}`)}
                      >
                        {type}
                      </Badge>
                    ))}
                  </div>

                  {/* Physical Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                    <div className="text-center lg:text-left">
                      <div className="text-muted-foreground">Height</div>
                      <div className="font-semibold text-foreground">
                        {(pokemon.height / 10).toFixed(1)} m
                      </div>
                    </div>
                    <div className="text-center lg:text-left">
                      <div className="text-muted-foreground">Weight</div>
                      <div className="font-semibold text-foreground">
                        {(pokemon.weight / 10).toFixed(1)} kg
                      </div>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  {showStats && (
                    <div className="space-y-2">
                      {pokemon.stats.slice(0, 3).map((stat) => (
                        <div key={stat.name} className="flex items-center gap-2">
                          {getStatIcon(stat.name)}
                          <span className="text-xs text-muted-foreground w-16 text-left">
                            {stat.name}
                          </span>
                          <div className="flex-1">
                            <Progress value={(stat.value / 200) * 100} className="h-2" />
                          </div>
                          <span className="text-xs font-medium text-foreground w-8 text-right">
                            {stat.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex lg:flex-col gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleFavoriteClick}
                    className={cn(
                      'border-white/20 backdrop-blur-sm',
                      isFavorite ? 'text-red-500 hover:text-red-600 bg-red-500/10' : 'text-muted-foreground hover:text-red-500'
                    )}
                  >
                    <Heart className={cn('h-4 w-4', isFavorite && 'fill-current')} />
                  </Button>

                  {isComparisonMode && (
                    <Button
                      variant={isSelected ? 'default' : 'outline'}
                      size="icon"
                      onClick={handleSelectClick}
                      className={cn(
                        'border-white/20 backdrop-blur-sm',
                        isSelected && 'pokeball-bg hover:bg-red-600'
                      )}
                    >
                      <BarChart3 className="h-4 w-4" />
                    </Button>
                  )}

                  <Button
                    variant="outline"
                    size="icon"
                    asChild
                    className="border-white/20 backdrop-blur-sm"
                  >
                    <Link href={`/pokemon/${pokemon.id}`}>
                      <Eye className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </div>
        </Link>
      </Card>
    );
  }

  // Default variant
  return (
    <Card className={cn('pokemon-card group cursor-pointer overflow-hidden', className)}>
      <Link href={`/pokemon/${pokemon.id}`}>
        <CardContent className="p-4">
          {/* Header with ID and Actions */}
          <div className="flex items-center justify-between mb-3">
            <Badge variant="secondary" className="text-xs">
              #{pokemon.id.toString().padStart(3, '0')}
            </Badge>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {isComparisonMode && (
                <Button
                  variant={isSelected ? 'default' : 'outline'}
                  size="icon"
                  onClick={handleSelectClick}
                  className={cn(
                    'h-6 w-6',
                    isSelected && 'pokeball-bg hover:bg-red-600'
                  )}
                >
                  <BarChart3 className="h-3 w-3" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleFavoriteClick}
                className={cn(
                  'h-6 w-6',
                  isFavorite ? 'text-red-500 hover:text-red-600' : 'text-muted-foreground hover:text-red-500'
                )}
              >
                <Heart className={cn('h-3 w-3', isFavorite && 'fill-current')} />
              </Button>
            </div>
          </div>

          {/* Pokemon Image */}
          <div className="relative mb-3">
            <div className="w-full h-32 relative">
              {pokemon.sprite ? (
                <Image
                  src={pokemon.sprite}
                  alt={pokemon.name}
                  fill
                  className="object-contain transition-transform group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
                  <span className="text-4xl">?</span>
                </div>
              )}
            </div>
          </div>

          {/* Pokemon Name */}
          <h3 className="font-semibold text-lg text-center text-foreground mb-2 truncate">
            {pokemon.name}
          </h3>

          {/* Types */}
          <div className="flex gap-1 justify-center mb-3 flex-wrap">
            {pokemon.types.map((type) => (
              <Badge
                key={type}
                className={cn('text-xs px-2 py-1 text-white capitalize', `type-${type}`)}
              >
                {type}
              </Badge>
            ))}
          </div>

          {/* Physical Stats */}
          <div className="grid grid-cols-2 gap-2 mb-3 text-xs text-muted-foreground">
            <div className="text-center">
              <div>Height</div>
              <div className="font-medium text-foreground">
                {(pokemon.height / 10).toFixed(1)}m
              </div>
            </div>
            <div className="text-center">
              <div>Weight</div>
              <div className="font-medium text-foreground">
                {(pokemon.weight / 10).toFixed(1)}kg
              </div>
            </div>
          </div>

          {/* Base Stats Preview */}
          {showStats && (
            <div className="space-y-1">
              {pokemon.stats.slice(0, 3).map((stat) => (
                <div key={stat.name} className="flex items-center gap-2 text-xs">
                  {getStatIcon(stat.name)}
                  <span className="text-muted-foreground flex-1 truncate">
                    {stat.name}
                  </span>
                  <div className="w-16 bg-muted rounded-full h-1.5">
                    <div
                      className={cn('h-full rounded-full', getStatColor(stat.value))}
                      style={{ width: `${Math.min((stat.value / 200) * 100, 100)}%` }}
                    />
                  </div>
                  <span className="font-medium text-foreground w-6 text-right">
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Link>
    </Card>
  );
}