import React, { useState, useEffect } from 'react';
import ProductSearch from '../components/ProductSearch';
import ProductCard from '../components/ProductCard';
import { getProducts, searchProducts } from '../services/productService';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setIsSearching(false);
      const data = await getProducts();
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
    loadProducts();
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
          {isSearching && (
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-200">
                Resultados de búsqueda ({products.length})
              </h2>
              <button 
                onClick={handleClearSearch}
                className="text-primary hover:underline text-sm"
              >
                Ver todos los productos
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
            <div className="text-center text-gray-400 py-12">
              <p className="text-lg">No se encontraron productos.</p>
              {isSearching && (
                <button 
                  onClick={handleClearSearch}
                  className="mt-4 text-primary hover:underline"
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
