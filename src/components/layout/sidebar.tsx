'use client';

import React from 'react';
import { X, RotateCcw, Filter, Sparkles, Grid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { usePokemonContext } from '@/contexts/pokemon-context';
import { POKEMON_TYPES, POKEMON_GENERATIONS, PokemonType } from '@/types/pokemon';
import { cn } from '@/lib/utils';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const {
    state,
    setFilter,
    resetFilters,
    setViewMode,
    toggleSidebar,
    setSidebar,
    isTypeSelected,
    isGenerationSelected,
    getActiveFiltersCount,
  } = usePokemonContext();

  const handleTypeToggle = (type: PokemonType) => {
    const isSelected = isTypeSelected(type);
    const newTypes = isSelected
      ? state.filters.types.filter(t => t !== type)
      : [...state.filters.types, type];

    setFilter({ types: newTypes });
  };

  const handleGenerationToggle = (generation: number) => {
    const isSelected = isGenerationSelected(generation);
    const newGenerations = isSelected
      ? state.filters.generations.filter(g => g !== generation)
      : [...state.filters.generations, generation];

    setFilter({ generations: newGenerations });
  };

  const handleSortChange = (sortBy: 'id' | 'name' | 'height' | 'weight') => {
    const newOrder = state.filters.sortBy === sortBy && state.filters.sortOrder === 'asc'
      ? 'desc'
      : 'asc';

    setFilter({ sortBy, sortOrder: newOrder });
  };

  const activeFiltersCount = getActiveFiltersCount();

  // Close sidebar on mobile when clicking outside
  const handleBackdropClick = () => {
    if (window.innerWidth < 1024) {
      setSidebar(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {state.sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={handleBackdropClick}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'pokemon-sidebar fixed left-0 top-0 h-full w-80 z-50 transition-transform duration-300 lg:relative lg:translate-x-0',
          state.sidebarOpen ? 'translate-x-0' : '-translate-x-full',
          className
        )}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/50">
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-white" />
              <h2 className="text-lg font-semibold text-white">Filters</h2>
              {activeFiltersCount > 0 && (
                <Badge className="pokeball-bg text-white border-none h-5 px-2">
                  {activeFiltersCount}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                disabled={activeFiltersCount === 0}
                className="text-white/70 hover:text-white hover:bg-white/10 h-8 px-2"
              >
                <RotateCcw className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="text-white/70 hover:text-white hover:bg-white/10 h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-4 space-y-6">
              {/* View Mode Toggle */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-white flex items-center gap-2">
                  <Grid className="h-4 w-4" />
                  View Mode
                </h3>
                <div className="flex gap-2">
                  <Button
                    variant={state.viewMode === 'grid' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      'flex-1',
                      state.viewMode === 'grid'
                        ? 'pokeball-bg text-white border-none'
                        : 'border-white/20 text-white hover:bg-white/10'
                    )}
                  >
                    <Grid className="h-4 w-4 mr-1" />
                    Grid
                  </Button>
                  <Button
                    variant={state.viewMode === 'list' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setViewMode('list')}
                    className={cn(
                      'flex-1',
                      state.viewMode === 'list'
                        ? 'pokeball-bg text-white border-none'
                        : 'border-white/20 text-white hover:bg-white/10'
                    )}
                  >
                    <List className="h-4 w-4 mr-1" />
                    List
                  </Button>
                </div>
              </div>

              <Separator className="bg-border/50" />

              {/* Show Favorites Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-white" />
                  <label className="text-sm font-medium text-white cursor-pointer">
                    Show Only Favorites
                  </label>
                </div>
                <Switch
                  checked={state.filters.favorites}
                  onCheckedChange={(checked) => setFilter({ favorites: checked })}
                  className="data-[state=checked]:bg-red-600"
                />
              </div>

              <Separator className="bg-border/50" />

              {/* Sort Options */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-white">Sort By</h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: 'id' as const, label: 'ID' },
                    { key: 'name' as const, label: 'Name' },
                    { key: 'height' as const, label: 'Height' },
                    { key: 'weight' as const, label: 'Weight' },
                  ].map((sort) => (
                    <Button
                      key={sort.key}
                      variant="outline"
                      size="sm"
                      onClick={() => handleSortChange(sort.key)}
                      className={cn(
                        'justify-start border-white/20 text-white hover:bg-white/10',
                        state.filters.sortBy === sort.key && 'pokeball-bg border-red-600'
                      )}
                    >
                      {sort.label}
                      {state.filters.sortBy === sort.key && (
                        <span className="ml-auto text-xs">
                          {state.filters.sortOrder === 'asc' ? '↑' : '↓'}
                        </span>
                      )}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator className="bg-border/50" />

              {/* Type Filters */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-white">Types</h3>
                  {state.filters.types.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setFilter({ types: [] })}
                      className="text-white/70 hover:text-white hover:bg-white/10 h-6 px-2 text-xs"
                    >
                      Clear
                    </Button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {POKEMON_TYPES.map((type) => (
                    <Button
                      key={type}
                      variant="outline"
                      size="sm"
                      onClick={() => handleTypeToggle(type)}
                      className={cn(
                        'justify-start border-white/20 text-white hover:bg-white/10 capitalize',
                        isTypeSelected(type) && `type-${type} border-current text-white font-medium`
                      )}
                    >
                      <span
                        className={cn(
                          'w-3 h-3 rounded-full mr-2',
                          `type-${type}`
                        )}
                      />
                      {type}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator className="bg-border/50" />

              {/* Generation Filters */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium text-white">Generations</h3>
                  {state.filters.generations.length > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setFilter({ generations: [] })}
                      className="text-white/70 hover:text-white hover:bg-white/10 h-6 px-2 text-xs"
                    >
                      Clear
                    </Button>
                  )}
                </div>
                <div className="space-y-2">
                  {POKEMON_GENERATIONS.map((gen) => (
                    <Button
                      key={gen.id}
                      variant="outline"
                      size="sm"
                      onClick={() => handleGenerationToggle(gen.id)}
                      className={cn(
                        'w-full justify-between border-white/20 text-white hover:bg-white/10',
                        isGenerationSelected(gen.id) && 'pokeball-bg border-red-600'
                      )}
                    >
                      <span>{gen.name}</span>
                      <span className="text-xs opacity-70">
                        #{gen.range[0]}-{gen.range[1]}
                      </span>
                    </Button>
                  ))}
                </div>
              </div>

              <Separator className="bg-border/50" />

              {/* Filter Summary */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-white">Active Filters</h3>
                <div className="space-y-2 text-sm text-white/70">
                  {state.filters.searchQuery && (
                    <div className="flex items-center justify-between">
                      <span>Search:</span>
                      <span className="text-white">"{state.filters.searchQuery}"</span>
                    </div>
                  )}
                  {state.filters.types.length > 0 && (
                    <div className="flex items-center justify-between">
                      <span>Types:</span>
                      <span className="text-white">{state.filters.types.length} selected</span>
                    </div>
                  )}
                  {state.filters.generations.length > 0 && (
                    <div className="flex items-center justify-between">
                      <span>Generations:</span>
                      <span className="text-white">{state.filters.generations.length} selected</span>
                    </div>
                  )}
                  {state.filters.favorites && (
                    <div className="flex items-center justify-between">
                      <span>Favorites:</span>
                      <span className="text-white">Only</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span>Sort:</span>
                    <span className="text-white capitalize">
                      {state.filters.sortBy} ({state.filters.sortOrder})
                    </span>
                  </div>
                  {activeFiltersCount === 0 && (
                    <div className="text-center text-white/50 py-4">
                      No filters active
                    </div>
                  )}
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>
      </aside>
    </>
  );
}