import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Button from './Button';

const ProductSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('search') || '');

  const handleSearch = (e) => {
    e.preventDefault();
    
    if (query.trim()) {
      setSearchParams({ search: query });
    } else {
      setSearchParams({});
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center space-x-2 mb-6 w-full">
      <div className="relative flex-grow">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar productos..."
          className="w-full px-4 py-3 pl-10 bg-card-bg border border-sage-200 rounded-lg text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm transition-all placeholder-gray-500"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>
      </div>
      
      <Button type="submit" className="py-3 px-6">
        Buscar
      </Button>
    </form>
  );
};

export default ProductSearch;
