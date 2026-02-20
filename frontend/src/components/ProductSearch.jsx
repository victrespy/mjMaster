import React, { useState } from 'react';
import { searchProducts } from '../services/productService';

const ProductSearch = ({ onSearchResults }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const results = await searchProducts(query);
      onSearchResults(results);
    } catch (error) {
      console.error("Error buscando productos:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center space-x-2 mb-6">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar productos..."
        className="flex-grow px-4 py-2 bg-card-bg border border-sage-200 rounded-md text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
      />
      <button
        type="submit"
        disabled={loading}
        className="px-4 py-2 bg-primary text-dark-bg font-bold rounded-md hover:bg-lime-400 transition-colors disabled:opacity-50"
      >
        {loading ? 'Buscando...' : 'Buscar'}
      </button>
    </form>
  );
};

export default ProductSearch;
