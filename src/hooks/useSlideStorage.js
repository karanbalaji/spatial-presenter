import { useState, useCallback } from 'react';
import { loadSlides as loadFromStorage, saveSlides as saveToStorage, clearSlides as clearFromStorage, generateId } from '../utils/slideStorage';

export function useSlideStorage() {
  const [slides, setSlides] = useState(() => loadFromStorage());

  const addSlides = useCallback((newSlides) => {
    const slidesWithIds = newSlides.map(slide => ({
      ...slide,
      id: generateId()
    }));
    
    setSlides(prev => {
      const updated = [...prev, ...slidesWithIds];
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const removeSlide = useCallback((slideId) => {
    setSlides(prev => {
      const updated = prev.filter(s => s.id !== slideId);
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const reorderSlides = useCallback((fromIndex, toIndex) => {
    setSlides(prev => {
      const updated = [...prev];
      const [removed] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, removed);
      saveToStorage(updated);
      return updated;
    });
  }, []);

  const clearAllSlides = useCallback(() => {
    clearFromStorage();
    setSlides([]);
  }, []);

  return {
    slides,
    isLoading: false,
    addSlides,
    removeSlide,
    reorderSlides,
    clearAllSlides
  };
}
