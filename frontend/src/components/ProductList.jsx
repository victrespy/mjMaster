import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from './ProductCard';
import ProductModal from './ProductModal';
import { getProducts, searchProducts } from '../services/productService';
import Button from './Button';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedProduct, setSelectedProduct] = useState(null);
  
  // Paginación
  const [page, setPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 12; // Catálogo general: 12 por página

  // Leemos los parámetros de la URL
  const categoryFilter = searchParams.get('category');
  const searchQuery = searchParams.get('search');

  // Resetear página al cambiar filtros
  useEffect(() => {
    setPage(1);
  }, [categoryFilter, searchQuery]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let result = { items: [], totalItems: 0 };
        
        if (searchQuery) {
          result = await searchProducts(searchQuery);
        } else {
          result = await getProducts(page, itemsPerPage, categoryFilter);
        }
        
        setProducts(result.items);
        setTotalItems(result.totalItems);
        
        // Debug para ver si llega el total
        console.log(`Cargados ${result.items.length} productos. Total: ${result.totalItems}`);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryFilter, searchQuery, page]);

  const clearFilters = () => {
    setSearchParams({});
  };

  const openModal = (product) => setSelectedProduct(product);
  const closeModal = () => setSelectedProduct(null);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Componente de controles de paginación
  const PaginationControls = () => {
    // Si no hay totalItems (backend antiguo) pero tenemos items, mostramos paginación simple
    // O si totalPages > 1
    const showPagination = totalPages > 1 || (totalItems === 0 && products.length === itemsPerPage);
    
    if (!showPagination) return null;
    
    return (
      <div className="flex justify-center items-center gap-4 my-8">
        <Button 
          variant="secondary" 
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-4 py-2"
        >
          &larr; Anterior
        </Button>
        
        <span className="text-gray-400 font-medium">
          {totalItems > 0 ? (
            <>Página <span className="text-primary">{page}</span> de {totalPages}</>
          ) : (
            <>Página <span className="text-primary">{page}</span></>
          )}
        </span>
        
        <Button 
          variant="secondary" 
          onClick={() => setPage(p => p + 1)}
          disabled={page === totalPages || (totalItems === 0 && products.length < itemsPerPage)}
          className="px-4 py-2"
        >
          Siguiente &rarr;
        </Button>
      </div>
    );
  };

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
            {totalItems > 0 ? `${totalItems} productos encontrados` : `${products.length} productos mostrados`}
          </span>
        </div>
      )}
      
      {/* Paginación Superior */}
      <PaginationControls />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} onOpen={openModal} />
        ))}
      </div>

      {/* Paginación Inferior */}
      <PaginationControls />

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={closeModal} />
      )}
    </div>
  );
};

export default ProductList;
