import { useEffect } from 'react';

// Hook para actualizar el título de la página en la pestaña del navegador.
// Uso: usePageTitle('Home') -> document.title = 'MJ | Home'
export default function usePageTitle(title) {
  useEffect(() => {
    const base = 'MJ';
    const fullTitle = title ? `${base} | ${title}` : base;
    const previous = document.title;

    document.title = fullTitle;

    return () => {
      // Opcional: restaurar el título anterior al desmontar
      // Esto evita dejar títulos incorrectos si un componente monta y desmonta rápidamente.
      document.title = previous;
    };
  }, [title]);
}

