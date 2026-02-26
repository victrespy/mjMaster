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
  const itemsPerPage = 12;

  // Leemos los parámetros de la URL
  const categoryFilter = searchParams.get('category');
  const searchQuery = searchParams.get('search');
  const minPrice = searchParams.get('minPrice');
  const maxPrice = searchParams.get('maxPrice');
  const sort = searchParams.get('sort');

  // Resetear página al cambiar filtros
  useEffect(() => {
    setPage(1);
  }, [categoryFilter, searchQuery, minPrice, maxPrice, sort]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        let result = { items: [], totalItems: 0 };
        
        // Preparamos los filtros
        const filters = {};
        if (minPrice) filters['price[gte]'] = minPrice;
        if (maxPrice) filters['price[lte]'] = maxPrice;
        
        // Preparamos el ordenamiento
        let orderBy = null;
        if (sort) {
          const [field, direction] = sort.split('_');
          if (field && direction) {
            orderBy = { [field]: direction };
          }
        }

        if (searchQuery) {
          // Si hay búsqueda, usamos searchProducts
          // Nota: searchProducts necesitaría actualizarse para soportar filtros adicionales si se desea
          result = await searchProducts(searchQuery);
        } else {
          // Si no, usamos getProducts con todos los filtros
          result = await getProducts(page, itemsPerPage, categoryFilter, orderBy, filters);
        }
        
        setProducts(result.items);
        setTotalItems(result.totalItems);
        
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryFilter, searchQuery, minPrice, maxPrice, sort, page]);

  const clearFilters = () => {
    setSearchParams({});
  };

  const openModal = (product) => setSelectedProduct(product);
  const closeModal = () => setSelectedProduct(null);

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Componente de controles de paginación
  const PaginationControls = () => {
    const showPagination = totalPages > 1 || page > 1 || (totalItems === 0 && products.length === itemsPerPage);
    
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
          disabled={(totalItems > 0 && page === totalPages) || (totalItems === 0 && products.length < itemsPerPage)}
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
        <div className="text-sm">
          <p>No hay resultados para los filtros seleccionados.</p>
          <button 
            onClick={clearFilters}
            className="mt-4 text-primary hover:underline font-medium"
          >
            Ver todos los productos
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Cabecera de Filtros Activos */}
      {(categoryFilter || searchQuery || minPrice || maxPrice || sort) && (
        <div className="mb-8 flex items-center justify-between bg-card-bg p-4 rounded-lg border border-sage-200/20 flex-wrap gap-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-gray-400">Filtros activos:</span>
            
            {categoryFilter && (
              <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-bold border border-primary/30">
                Categoría: {categoryFilter}
              </span>
            )}
            
            {searchQuery && (
              <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-bold border border-primary/30">
                Búsqueda: {searchQuery}
              </span>
            )}

            {(minPrice || maxPrice) && (
              <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-bold border border-primary/30">
                Precio: {minPrice || '0'} - {maxPrice || '∞'} €
              </span>
            )}

            <button 
              onClick={clearFilters}
              className="text-gray-400 hover:text-white transition-colors ml-2 text-sm underline"
            >
              Limpiar todo
            </button>
          </div>
          <span className="text-sm text-gray-500">
            {totalItems > 0 ? `${totalItems} productos` : `${products.length} mostrados`}
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
