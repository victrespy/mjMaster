import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ category }) => {
  // Usamos URL absoluta para consistencia con ProductCard
  const API_BASE_URL = "https://localhost:9443";

  const getImageUrl = (path) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const imageUrl = getImageUrl(category.picture);

  // Fallback icon si no hay imagen
  const getIcon = (name) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('semilla')) return '🌱';
    if (lowerName.includes('cultivo')) return '🌿';
    if (lowerName.includes('parafernalia')) return '💨';
    if (lowerName.includes('vaporizador')) return '🌬️';
    return '📦';
  };

  return (
    <Link 
      to={`/products?category=${encodeURIComponent(category.name)}`}
      className="group block h-64 rounded-xl overflow-hidden relative shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
    >
      {imageUrl ? (
        <>
          <img 
            src={imageUrl} 
            alt={category.name} 
            className="w-full h-full object-fit transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              e.target.style.display = 'none'; // Ocultar imagen rota
              e.target.nextSibling.style.display = 'flex'; // Mostrar fallback
            }}
          />
          {/* Fallback oculto por defecto */}
          <div className="absolute inset-0 bg-card-bg flex-col items-center justify-center hidden">
            <div className="text-5xl mb-4">{getIcon(category.name)}</div>
          </div>
        </>
      ) : (
        <div className="w-full h-full bg-card-bg border border-sage-200/30 flex flex-col items-center justify-center">
          <div className="text-5xl mb-4 transform transition-transform duration-300 group-hover:scale-110">
            {getIcon(category.name)}
          </div>
        </div>
      )}

      {/* Overlay Gradiente */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-70 transition-opacity"></div>

      {/* Contenido */}
      <div className="absolute bottom-0 left-0 p-6 w-full z-10">
        <h3 className="text-2xl font-bold text-white mb-1 group-hover:text-primary transition-colors">
          {category.name}
        </h3>
        <p className="text-gray-300 text-sm transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
          Explorar Categoría &rarr;
        </p>
      </div>
    </Link>
  );
};

export default CategoryCard;
