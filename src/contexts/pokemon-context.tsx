'use client';

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { PokemonFilter, PokemonType, POKEMON_TYPES } from '@/types/pokemon';

// State interface
interface PokemonState {
  filters: PokemonFilter;
  favorites: number[];
  searchHistory: string[];
  viewMode: 'grid' | 'list';
  selectedPokemon: number[];
  comparisonMode: boolean;
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
}

// Action types
type PokemonAction =
  | { type: 'SET_FILTER'; payload: Partial<PokemonFilter> }
  | { type: 'RESET_FILTERS' }
  | { type: 'ADD_TO_FAVORITES'; payload: number }
  | { type: 'REMOVE_FROM_FAVORITES'; payload: number }
  | { type: 'TOGGLE_FAVORITE'; payload: number }
  | { type: 'CLEAR_FAVORITES' }
  | { type: 'ADD_SEARCH_TERM'; payload: string }
  | { type: 'CLEAR_SEARCH_HISTORY' }
  | { type: 'SET_VIEW_MODE'; payload: 'grid' | 'list' }
  | { type: 'SELECT_POKEMON'; payload: number }
  | { type: 'DESELECT_POKEMON'; payload: number }
  | { type: 'CLEAR_SELECTION' }
  | { type: 'TOGGLE_COMPARISON_MODE' }
  | { type: 'TOGGLE_SIDEBAR' }
  | { type: 'SET_SIDEBAR'; payload: boolean }
  | { type: 'SET_THEME'; payload: 'light' | 'dark' }
  | { type: 'LOAD_PERSISTED_STATE'; payload: Partial<PokemonState> };

// Initial state
const initialState: PokemonState = {
  filters: {
    types: [],
    generations: [],
    searchQuery: '',
    favorites: false,
    sortBy: 'id',
    sortOrder: 'asc',
  },
  favorites: [],
  searchHistory: [],
  viewMode: 'grid',
  selectedPokemon: [],
  comparisonMode: false,
  sidebarOpen: true,
  theme: 'dark', // Default to dark theme as per design reference
};

// Reducer function
function pokemonReducer(state: PokemonState, action: PokemonAction): PokemonState {
  switch (action.type) {
    case 'SET_FILTER':
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
      };

    case 'RESET_FILTERS':
      return {
        ...state,
        filters: {
          ...initialState.filters,
          searchQuery: state.filters.searchQuery, // Keep search query when resetting
        },
      };

    case 'ADD_TO_FAVORITES':
      if (state.favorites.includes(action.payload)) {
        return state;
      }
      return {
        ...state,
        favorites: [...state.favorites, action.payload],
      };

    case 'REMOVE_FROM_FAVORITES':
      return {
        ...state,
        favorites: state.favorites.filter(id => id !== action.payload),
        selectedPokemon: state.selectedPokemon.filter(id => id !== action.payload),
      };

    case 'TOGGLE_FAVORITE':
      const isFavorite = state.favorites.includes(action.payload);
      return {
        ...state,
        favorites: isFavorite
          ? state.favorites.filter(id => id !== action.payload)
          : [...state.favorites, action.payload],
      };

    case 'CLEAR_FAVORITES':
      return {
        ...state,
        favorites: [],
      };

    case 'ADD_SEARCH_TERM':
      const searchTerm = action.payload.trim().toLowerCase();
      if (!searchTerm || state.searchHistory.includes(searchTerm)) {
        return state;
      }
      return {
        ...state,
        searchHistory: [searchTerm, ...state.searchHistory.slice(0, 9)], // Keep last 10 searches
      };

    case 'CLEAR_SEARCH_HISTORY':
      return {
        ...state,
        searchHistory: [],
      };

    case 'SET_VIEW_MODE':
      return {
        ...state,
        viewMode: action.payload,
      };

    case 'SELECT_POKEMON':
      if (state.selectedPokemon.includes(action.payload)) {
        return state;
      }
      // Limit selection to 2 Pokemon for comparison
      const newSelection = state.comparisonMode
        ? state.selectedPokemon.length >= 2
          ? [state.selectedPokemon[1], action.payload]
          : [...state.selectedPokemon, action.payload]
        : [action.payload];

      return {
        ...state,
        selectedPokemon: newSelection,
      };

    case 'DESELECT_POKEMON':
      return {
        ...state,
        selectedPokemon: state.selectedPokemon.filter(id => id !== action.payload),
      };

    case 'CLEAR_SELECTION':
      return {
        ...state,
        selectedPokemon: [],
      };

    case 'TOGGLE_COMPARISON_MODE':
      return {
        ...state,
        comparisonMode: !state.comparisonMode,
        selectedPokemon: !state.comparisonMode ? [] : state.selectedPokemon,
      };

    case 'TOGGLE_SIDEBAR':
      return {
        ...state,
        sidebarOpen: !state.sidebarOpen,
      };

    case 'SET_SIDEBAR':
      return {
        ...state,
        sidebarOpen: action.payload,
      };

    case 'SET_THEME':
      return {
        ...state,
        theme: action.payload,
      };

    case 'LOAD_PERSISTED_STATE':
      return {
        ...state,
        ...action.payload,
      };

    default:
      return state;
  }
}

// Context
interface PokemonContextType {
  state: PokemonState;
  dispatch: React.Dispatch<PokemonAction>;
  // Convenience methods
  setFilter: (filter: Partial<PokemonFilter>) => void;
  resetFilters: () => void;
  toggleFavorite: (pokemonId: number) => void;
  addSearchTerm: (term: string) => void;
  setViewMode: (mode: 'grid' | 'list') => void;
  selectPokemon: (pokemonId: number) => void;
  deselectPokemon: (pokemonId: number) => void;
  clearSelection: () => void;
  toggleComparisonMode: () => void;
  toggleSidebar: () => void;
  setSidebar: (open: boolean) => void;
  setTheme: (theme: 'light' | 'dark') => void;
  // Utility methods
  isTypeSelected: (type: PokemonType) => boolean;
  isGenerationSelected: (generation: number) => boolean;
  isPokemonSelected: (pokemonId: number) => boolean;
  isPokemonFavorite: (pokemonId: number) => boolean;
  getActiveFiltersCount: () => number;
}

const PokemonContext = createContext<PokemonContextType | undefined>(undefined);

// Provider component
interface PokemonProviderProps {
  children: ReactNode;
}

export function PokemonProvider({ children }: PokemonProviderProps) {
  const [state, dispatch] = useReducer(pokemonReducer, initialState);

  // Load persisted state on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const persistedFavorites = localStorage.getItem('pokemon-favorites');
        const persistedSearchHistory = localStorage.getItem('pokemon-search-history');
        const persistedViewMode = localStorage.getItem('pokemon-view-mode');
        const persistedTheme = localStorage.getItem('pokemon-theme');
        const persistedSidebar = localStorage.getItem('pokemon-sidebar-open');

        const persistedState: Partial<PokemonState> = {};

        if (persistedFavorites) {
          persistedState.favorites = JSON.parse(persistedFavorites);
        }

        if (persistedSearchHistory) {
          persistedState.searchHistory = JSON.parse(persistedSearchHistory);
        }

        if (persistedViewMode) {
          persistedState.viewMode = persistedViewMode as 'grid' | 'list';
        }

        if (persistedTheme) {
          persistedState.theme = persistedTheme as 'light' | 'dark';
        }

        if (persistedSidebar) {
          persistedState.sidebarOpen = JSON.parse(persistedSidebar);
        }

        if (Object.keys(persistedState).length > 0) {
          dispatch({ type: 'LOAD_PERSISTED_STATE', payload: persistedState });
        }
      } catch (error) {
        console.error('Error loading persisted state:', error);
      }
    }
  }, []);

  // Persist state changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pokemon-favorites', JSON.stringify(state.favorites));
    }
  }, [state.favorites]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pokemon-search-history', JSON.stringify(state.searchHistory));
    }
  }, [state.searchHistory]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pokemon-view-mode', state.viewMode);
    }
  }, [state.viewMode]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pokemon-theme', state.theme);
    }
  }, [state.theme]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pokemon-sidebar-open', JSON.stringify(state.sidebarOpen));
    }
  }, [state.sidebarOpen]);

  // Apply theme to document
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.className = state.theme;
    }
  }, [state.theme]);

  // Convenience methods
  const setFilter = (filter: Partial<PokemonFilter>) => {
    dispatch({ type: 'SET_FILTER', payload: filter });
  };

  const resetFilters = () => {
    dispatch({ type: 'RESET_FILTERS' });
  };

  const toggleFavorite = (pokemonId: number) => {
    dispatch({ type: 'TOGGLE_FAVORITE', payload: pokemonId });
  };

  const addSearchTerm = (term: string) => {
    if (term.trim()) {
      dispatch({ type: 'ADD_SEARCH_TERM', payload: term });
    }
  };

  const setViewMode = (mode: 'grid' | 'list') => {
    dispatch({ type: 'SET_VIEW_MODE', payload: mode });
  };

  const selectPokemon = (pokemonId: number) => {
    dispatch({ type: 'SELECT_POKEMON', payload: pokemonId });
  };

  const deselectPokemon = (pokemonId: number) => {
    dispatch({ type: 'DESELECT_POKEMON', payload: pokemonId });
  };

  const clearSelection = () => {
    dispatch({ type: 'CLEAR_SELECTION' });
  };

  const toggleComparisonMode = () => {
    dispatch({ type: 'TOGGLE_COMPARISON_MODE' });
  };

  const toggleSidebar = () => {
    dispatch({ type: 'TOGGLE_SIDEBAR' });
  };

  const setSidebar = (open: boolean) => {
    dispatch({ type: 'SET_SIDEBAR', payload: open });
  };

  const setTheme = (theme: 'light' | 'dark') => {
    dispatch({ type: 'SET_THEME', payload: theme });
  };

  // Utility methods
  const isTypeSelected = (type: PokemonType) => {
    return state.filters.types.includes(type);
  };

  const isGenerationSelected = (generation: number) => {
    return state.filters.generations.includes(generation);
  };

  const isPokemonSelected = (pokemonId: number) => {
    return state.selectedPokemon.includes(pokemonId);
  };

  const isPokemonFavorite = (pokemonId: number) => {
    return state.favorites.includes(pokemonId);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (state.filters.types.length > 0) count++;
    if (state.filters.generations.length > 0) count++;
    if (state.filters.searchQuery) count++;
    if (state.filters.favorites) count++;
    return count;
  };

  const contextValue: PokemonContextType = {
    state,
    dispatch,
    setFilter,
    resetFilters,
    toggleFavorite,
    addSearchTerm,
    setViewMode,
    selectPokemon,
    deselectPokemon,
    clearSelection,
    toggleComparisonMode,
    toggleSidebar,
    setSidebar,
    setTheme,
    isTypeSelected,
    isGenerationSelected,
    isPokemonSelected,
    isPokemonFavorite,
    getActiveFiltersCount,
  };

  return (
    <PokemonContext.Provider value={contextValue}>
      {children}
    </PokemonContext.Provider>
  );
}

// Hook to use the context
export function usePokemonContext() {
  const context = useContext(PokemonContext);
  if (context === undefined) {
    throw new Error('usePokemonContext must be used within a PokemonProvider');
  }
  return context;
}