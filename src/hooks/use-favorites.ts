import { useState, useEffect } from 'react';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('item-favorites');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('item-favorites', JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (itemName: string) => {
    setFavorites(prev => 
      prev.includes(itemName)
        ? prev.filter(name => name !== itemName)
        : [...prev, itemName]
    );
  };

  const isFavorite = (itemName: string) => favorites.includes(itemName);

  return { favorites, toggleFavorite, isFavorite };
}