import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductSearch from '../components/ProductSearch';
import ProductCard from '../components/ProductCard';
import { getProducts } from '../services/productService';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  // Leemos el parámetro 'category' de la URL
  const categoryFilter = searchParams.get('category');

  useEffect(() => {
    loadProducts();
  }, [categoryFilter]); // Recargar cuando cambie la categoría

  const loadProducts = async () => {
    try {
      setLoading(true);
      setIsSearching(false);
      
      // Pasamos la categoría al servicio
      const data = await getProducts(1, 30, categoryFilter);
      setProducts(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchResults = (results) => {
    setProducts(results);
    setIsSearching(true);
  };

  const handleClearSearch = () => {
    // Limpiamos la búsqueda y volvemos a cargar (respetando la categoría si existe)
    loadProducts();
  };

  const clearCategoryFilter = () => {
    setSearchParams({}); // Elimina todos los parámetros de la URL
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-8 text-center">Catálogo de Productos</h1>
      
      <div className="max-w-2xl mx-auto mb-12">
        <ProductSearch onSearchResults={handleSearchResults} />
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-8">
          <p>Error: {error}</p>
        </div>
      ) : (
        <div>
          {/* Cabecera de resultados (Búsqueda o Categoría) */}
          {(isSearching || categoryFilter) && (
            <div className="flex justify-between items-center mb-6 bg-card-bg p-4 rounded-lg border border-sage-200/20">
              <h2 className="text-xl font-semibold text-gray-200 flex items-center gap-2">
                {isSearching ? (
                  <>Resultados de búsqueda ({products.length})</>
                ) : (
                  <>Categoría: <span className="text-primary">{categoryFilter}</span> ({products.length})</>
                )}
              </h2>
              
              <button 
                onClick={isSearching ? handleClearSearch : clearCategoryFilter}
                className="text-gray-400 hover:text-white hover:underline text-sm flex items-center gap-1 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                {isSearching ? 'Limpiar búsqueda' : 'Ver todas las categorías'}
              </button>
            </div>
          )}

          {products?.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-12 bg-card-bg rounded-xl border border-sage-200/10">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-lg font-medium mb-2">No se encontraron productos.</p>
              <p className="text-sm text-gray-500">Intenta con otra categoría o término de búsqueda.</p>
              
              {(isSearching || categoryFilter) && (
                <button 
                  onClick={isSearching ? handleClearSearch : clearCategoryFilter}
                  className="mt-6 bg-sage-200/20 text-primary px-6 py-2 rounded-lg hover:bg-sage-200/40 transition-colors"
                >
                  Volver al catálogo completo
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Products;
