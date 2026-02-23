import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import { getProducts, searchProducts } from '../services/productService';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Leemos los parámetros de la URL
  const categoryFilter = searchParams.get('category');
  const searchQuery = searchParams.get('search'); // Nuevo: Filtro de búsqueda

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let data = [];
        
        if (searchQuery) {
          // Si hay búsqueda, usamos searchProducts
          console.log("🔍 ProductList: Buscando por:", searchQuery);
          data = await searchProducts(searchQuery);
        } else {
          // Si no, usamos getProducts (con o sin categoría)
          console.log("🔍 ProductList: Filtrando por categoría:", categoryFilter);
          data = await getProducts(1, 30, categoryFilter);
        }
        
        setProducts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryFilter, searchQuery]); // Se ejecuta cuando cambia categoría o búsqueda

  const clearFilters = () => {
    setSearchParams({}); // Limpia todos los parámetros de la URL
  };

  const openModal = (product) => setSelectedProduct(product);
  const closeModal = () => setSelectedProduct(null);

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
      <div className="text-center text-gray-400 py-16 bg-card-bg rounded-xl border border-sage-200/10">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-xl font-semibold mb-2">No se encontraron productos</p>
        {(categoryFilter || searchQuery) && (
          <div className="text-sm">
            <p>No hay resultados para {categoryFilter ? `la categoría "${categoryFilter}"` : `la búsqueda "${searchQuery}"`}.</p>
            <button 
              onClick={clearFilters}
              className="mt-4 text-primary hover:underline font-medium"
            >
              Ver todos los productos
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* Cabecera de Filtros Activos */}
      {(categoryFilter || searchQuery) && (
        <div className="mb-8 flex items-center justify-between bg-card-bg p-4 rounded-lg border border-sage-200/20">
          <div className="flex items-center gap-2">
            <span className="text-gray-400">Mostrando resultados de:</span>
            <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-bold border border-primary/30 flex items-center gap-2">
              {categoryFilter ? `Categoría: ${categoryFilter}` : `Búsqueda: ${searchQuery}`}
              <button 
                onClick={clearFilters}
                className="hover:text-white transition-colors ml-1"
                title="Quitar filtro"
              >
                ×
              </button>
            </span>
          </div>
          <span className="text-sm text-gray-500 hidden sm:inline">
            {products.length} productos encontrados
          </span>
        </div>
      )}
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onOpen={openModal} />
        ))}
      </div>

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={closeModal} />
      )}
    </div>
  );
};

export default ProductList;
