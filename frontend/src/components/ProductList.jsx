import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from './ProductCard';
import { getProducts } from '../services/productService';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams] = useSearchParams();

  // Leemos el parámetro 'category' de la URL (ej: ?category=Semillas)
  const categoryFilter = searchParams.get('category');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        console.log("🔍 ProductList: Filtrando por categoría:", categoryFilter);

        // Pasamos la categoría al servicio (si existe)
        const data = await getProducts(1, 30, categoryFilter);
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryFilter]); // Se ejecuta cada vez que cambia la categoría en la URL

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-8">
        <p>Error al cargar productos: {error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center text-gray-400 py-16">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-xl font-semibold mb-2">No se encontraron productos</p>
        {categoryFilter && (
          <p className="text-sm">
            No hay productos en la categoría <span className="text-primary font-bold">"{categoryFilter}"</span>.
          </p>
        )}
      </div>
    );
  }

  return (
    <div>
      {categoryFilter && (
        <div className="mb-8 flex items-center gap-2">
          <span className="text-gray-400">Filtrando por:</span>
          <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-bold border border-primary/30 flex items-center gap-2">
            {categoryFilter}
            <button 
              onClick={() => window.history.back()} // O usar navigate('/products')
              className="hover:text-white transition-colors"
              title="Quitar filtro"
            >
              ×
            </button>
          </span>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductList;
