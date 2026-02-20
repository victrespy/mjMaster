import React from 'react';
import ProductSearch from '../components/ProductSearch';
import ProductList from '../components/ProductList';

const Products = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary mb-8 text-center">Catálogo de Productos</h1>
      
      <div className="max-w-2xl mx-auto mb-12">
        <ProductSearch />
      </div>

      <ProductList />
    </div>
  );
};

export default Products;
