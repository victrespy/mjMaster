import React from 'react';
import { Link } from 'react-router-dom';

const CategoryCard = ({ category }) => {
  // Generar un color o icono basado en el ID o nombre para dar variedad visual
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
      className="group block h-full"
    >
      <div className="bg-card-bg border border-sage-200/30 rounded-xl p-6 h-full flex flex-col items-center justify-center text-center transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1">
        <div className="text-4xl mb-4 transform transition-transform duration-300 group-hover:scale-110">
          {getIcon(category.name)}
        </div>
        <h3 className="text-xl font-bold text-gray-200 group-hover:text-primary transition-colors">
          {category.name}
        </h3>
        <p className="text-sm text-gray-500 mt-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Ver Productos &rarr;
        </p>
      </div>
    </Link>
  );
};

export default CategoryCard;
