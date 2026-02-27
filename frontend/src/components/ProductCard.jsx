import React from 'react';
import { useCart } from '../context/CartContext';
import Button from './Button';
import { API_BASE_URL } from '../config';

const ProductCard = ({ product, onOpen }) => {
  const { addToCart } = useCart();
  
  // Procesar la URL de la imagen
  let imageUrl = '/products/placeholder.avif';
  if (product.picture) {
    if (product.picture.startsWith('http')) {
      imageUrl = product.picture;
    } else {
      // Usamos la URL base dinámica (localhost o ngrok)
      imageUrl = `${API_BASE_URL}${product.picture.startsWith('/') ? '' : '/'}${product.picture}`;
    }
  }

  const handleAddToCart = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div
      onClick={() => onOpen?.(product)}
      role="button"
      tabIndex={0}
      className="bg-card-bg border border-sage-200 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col h-full group cursor-pointer"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.target.onerror = null; 
            e.target.src = '/products/placeholder.avif';
          }}
        />
        {product.stock <= 0 && (
          <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold px-2 py-1 m-2 rounded">
            Agotado
          </div>
        )}

        {product.stock > 0 && product.stock <= 20 && (
          <div className="absolute top-0 right-0 bg-amber-500 text-black text-xs font-bold px-2 py-1 m-2 rounded text-right">
            QUEDAN POCAS UNIDADES
          </div>
        )}
      </div>
      
      <div className="p-4 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-100 mb-1 line-clamp-2">{product.name}</h3>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <span className="text-xl font-bold text-primary">{parseFloat(product.price).toFixed(2)} €</span>
          
          {product.stock > 0 ? (
            <Button 
              onClick={handleAddToCart}
              className="px-3 py-1.5 text-sm"
            >
              Añadir
            </Button>
          ) : (
            <button 
              className="px-3 py-1.5 rounded text-sm font-medium bg-gray-600 text-gray-300 cursor-not-allowed"
              disabled
            >
              Sin Stock
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
