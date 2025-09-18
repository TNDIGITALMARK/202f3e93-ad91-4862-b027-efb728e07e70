'use client';

import React from 'react';
import Link from 'next/link';
import { Search, Menu, Home, Database, Zap, Newspaper, User, Heart, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { usePokemonContext } from '@/contexts/pokemon-context';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const {
    state,
    setFilter,
    addSearchTerm,
    toggleSidebar,
    toggleComparisonMode,
    getActiveFiltersCount,
  } = usePokemonContext();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;

    if (query?.trim()) {
      setFilter({ searchQuery: query.trim() });
      addSearchTerm(query.trim());
    }
  };

  const clearSearch = () => {
    setFilter({ searchQuery: '' });
  };

  const navigationItems = [
    { href: '/', icon: Home, label: 'Home', active: true },
    { href: '/database', icon: Database, label: 'Database', active: false },
    { href: '/abilities', icon: Zap, label: 'Abilities', active: false },
    { href: '/news', icon: Newspaper, label: 'News', active: false },
    { href: '/account', icon: User, label: 'Account', active: false },
  ];

  const activeFiltersCount = getActiveFiltersCount();

  return (
    <header className={cn('pokemon-gradient border-b border-border/50 backdrop-blur-sm', className)}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Logo and Navigation */}
          <div className="flex items-center gap-8">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="lg:hidden pokeball-red hover:bg-white/10"
            >
              <Menu className="h-5 w-5" />
            </Button>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="w-10 h-10 pokeball-bg rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                  <div className="w-4 h-4 bg-white rounded-full"></div>
                </div>
                <div className="absolute inset-0 w-10 h-10 border-4 border-white rounded-full"></div>
                <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white transform -translate-y-px"></div>
              </div>
              <span className="text-xl font-bold text-white tracking-wide hidden sm:block">
                POKÉDEX
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                      item.active
                        ? 'text-white bg-white/10 border border-white/20'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Center: Search */}
          <div className="flex-1 max-w-md mx-4">
            <form onSubmit={handleSearch} className="relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  name="search"
                  placeholder="Search Pokemon..."
                  defaultValue={state.filters.searchQuery}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:bg-white/20 focus:border-white/30"
                />
                {state.filters.searchQuery && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={clearSearch}
                    className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-white/50 hover:text-white"
                  >
                    ×
                  </Button>
                )}
              </div>
            </form>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Filters Badge */}
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="pokeball-bg text-white border-none">
                {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''}
              </Badge>
            )}

            {/* Favorites Count */}
            <Button
              variant="ghost"
              size="sm"
              asChild
              className="text-white hover:bg-white/10 relative"
            >
              <Link href="/favorites" className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                <span className="hidden sm:inline">Favorites</span>
                {state.favorites.length > 0 && (
                  <Badge className="pokeball-bg text-white border-none ml-1 h-5 px-1.5 text-xs">
                    {state.favorites.length}
                  </Badge>
                )}
              </Link>
            </Button>

            {/* Comparison Mode Toggle */}
            <Button
              variant={state.comparisonMode ? 'default' : 'ghost'}
              size="sm"
              onClick={toggleComparisonMode}
              className={cn(
                'text-white relative',
                state.comparisonMode
                  ? 'pokeball-bg hover:bg-red-600'
                  : 'hover:bg-white/10'
              )}
            >
              <BarChart3 className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">Compare</span>
              {state.selectedPokemon.length > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-yellow-500 text-xs text-black">
                  {state.selectedPokemon.length}
                </Badge>
              )}
            </Button>

            {/* Desktop Sidebar Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="hidden lg:flex text-white hover:bg-white/10"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav className="lg:hidden mt-4 flex items-center gap-1 overflow-x-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
                  item.active
                    ? 'text-white bg-white/10 border border-white/20'
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Search Suggestions (if there's a query) */}
        {state.searchHistory.length > 0 && state.filters.searchQuery === '' && (
          <div className="mt-4 lg:hidden">
            <div className="text-xs text-white/60 mb-2">Recent searches:</div>
            <div className="flex gap-2 overflow-x-auto">
              {state.searchHistory.slice(0, 5).map((term, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilter({ searchQuery: term })}
                  className="text-white/70 hover:text-white hover:bg-white/5 whitespace-nowrap"
                >
                  {term}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Comparison Mode Banner */}
      {state.comparisonMode && (
        <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-t border-yellow-500/30">
          <div className="container mx-auto px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-yellow-300" />
                <span className="text-sm text-yellow-100">
                  Comparison mode active - Select up to 2 Pokémon to compare
                </span>
              </div>
              <div className="flex items-center gap-2">
                {state.selectedPokemon.length === 2 && (
                  <Button
                    size="sm"
                    variant="outline"
                    asChild
                    className="border-yellow-400 text-yellow-100 hover:bg-yellow-400 hover:text-black"
                  >
                    <Link href="/compare">
                      View Comparison
                    </Link>
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={toggleComparisonMode}
                  className="text-yellow-100 hover:bg-white/10"
                >
                  Exit
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}