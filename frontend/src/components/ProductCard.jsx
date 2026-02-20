import React from 'react';

const ProductCard = ({ product }) => {
  // Imagen por defecto si no viene una válida
  const imageUrl = product.picture ? product.picture : '/products/placeholder.avif';

  return (
    <div className="bg-card-bg border border-sage-200 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col h-full">
      <div className="relative h-48 overflow-hidden group">
        <img 
          src={imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {product.stock <= 0 && (
          <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-2 py-1 m-2 rounded">
            Agotado
          </div>
        )}
      </div>
      
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-100 mb-1 line-clamp-2">{product.name}</h3>
          <p className="text-gray-400 text-sm mb-3 line-clamp-3">{product.description}</p>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-primary">{parseFloat(product.price).toFixed(2)} €</span>
          <button 
            className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
              product.stock > 0 
                ? 'bg-primary text-dark-bg hover:bg-lime-400' 
                : 'bg-gray-600 text-gray-300 cursor-not-allowed'
            }`}
            disabled={product.stock <= 0}
          >
            {product.stock > 0 ? 'Añadir' : 'Sin Stock'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
