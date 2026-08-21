import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { IProperty } from '../types';
import { favoritesService, propertyService } from '../services/api';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

interface FavoritesContextType {
  favoriteIds: string[];
  favoriteProperties: IProperty[];
  isLoading: boolean;
  isFavorite: (propertyId: string) => boolean;
  toggleFavorite: (property: IProperty) => Promise<void>;
  refreshFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, openAuthModal } = useAuth();
  const { success, info } = useToast();
  const [favoriteIds, setFavoriteIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('growth_realtors_guest_favs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [favoriteProperties, setFavoriteProperties] = useState<IProperty[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchFavoritesData = useCallback(async () => {
    setIsLoading(true);
    try {
      if (isAuthenticated) {
        const res = await favoritesService.getFavorites();
        if (res.success) {
          setFavoriteIds(res.favorites || []);
          setFavoriteProperties(res.properties || []);
        }
      } else {
        // Guest mode: fetch properties corresponding to guest favorite IDs
        const saved = localStorage.getItem('growth_realtors_guest_favs');
        const ids: string[] = saved ? JSON.parse(saved) : [];
        setFavoriteIds(ids);
        if (ids.length > 0) {
          const res = await propertyService.getProperties({ limit: 50 });
          if (res.success) {
            setFavoriteProperties(res.properties.filter(p => ids.includes(p.id)));
          }
        } else {
          setFavoriteProperties([]);
        }
      }
    } catch (err) {
      console.error('Error fetching favorites:', err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchFavoritesData();
  }, [fetchFavoritesData, user]);

  const isFavorite = (propertyId: string): boolean => {
    return favoriteIds.includes(propertyId);
  };

  const toggleFavorite = async (property: IProperty) => {
    const currentlyFav = isFavorite(property.id);

    if (isAuthenticated) {
      try {
        const res = await favoritesService.toggleFavorite(property.id);
        if (res.success) {
          setFavoriteIds(res.favorites);
          if (res.isFavorite) {
            setFavoriteProperties(prev => [...prev.filter(p => p.id !== property.id), property]);
            success(`Saved "${property.title}" to favorites.`);
          } else {
            setFavoriteProperties(prev => prev.filter(p => p.id !== property.id));
            info(`Removed from favorites.`);
          }
        }
      } catch (err: any) {
        console.error('Failed to toggle favorite:', err);
      }
    } else {
      // Guest mode
      let updated: string[];
      if (currentlyFav) {
        updated = favoriteIds.filter(id => id !== property.id);
        setFavoriteProperties(prev => prev.filter(p => p.id !== property.id));
        info('Removed from favorites.');
      } else {
        updated = [...favoriteIds, property.id];
        setFavoriteProperties(prev => [...prev, property]);
        success('Property saved to favorites! (Log in to sync across devices)');
      }
      setFavoriteIds(updated);
      localStorage.setItem('growth_realtors_guest_favs', JSON.stringify(updated));
    }
  };

  return (
    <FavoritesContext.Provider
      value={{
        favoriteIds,
        favoriteProperties,
        isLoading,
        isFavorite,
        toggleFavorite,
        refreshFavorites: fetchFavoritesData
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
