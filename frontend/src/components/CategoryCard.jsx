import React from 'react';
import { Link } from 'react-router-dom';
import { API_BASE_URL } from '../config';

const CategoryCard = ({ category }) => {
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
    if (lowerName.includes('iluminación')) return '💡';
    if (lowerName.includes('fertilizante')) return '🧪';
    if (lowerName.includes('sustrato')) return '🟤';
    if (lowerName.includes('clima')) return '🌡️';
    if (lowerName.includes('cosecha')) return '✂️';
    if (lowerName.includes('cbd')) return '💊';
    return '📦';
  };

  return (
    <Link 
      to={`/products?category=${encodeURIComponent(category.name)}`}
      className="group block h-40 rounded-xl overflow-hidden relative shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-sage-200/10"
    >
      {imageUrl ? (
        <>
          <img 
            src={imageUrl} 
            alt={category.name} 
            className="w-full h-full object-contain p-5 transition-transform duration-700 group-hover:scale-110"
            onError={(e) => {
              e.target.style.display = 'none'; 
              e.target.nextSibling.style.display = 'flex'; 
            }}
          />
          <div className="absolute inset-0 bg-card-bg flex-col items-center justify-center hidden">
            <div className="text-4xl">{getIcon(category.name)}</div>
          </div>
        </>
      ) : (
        <div className="w-full h-full bg-card-bg flex flex-col items-center justify-center">
          <div className="text-4xl transform transition-transform duration-300 group-hover:scale-110">
            {getIcon(category.name)}
          </div>
        </div>
      )}

      {/* Overlay Gradiente más sutil */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90 group-hover:opacity-70 transition-opacity"></div>

      {/* Contenido Compacto */}
      <div className="absolute bottom-0 left-0 p-4 w-full z-10">
        <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors leading-tight">
          {category.name}
        </h3>
      </div>
    </Link>
  );
};

export default CategoryCard;
