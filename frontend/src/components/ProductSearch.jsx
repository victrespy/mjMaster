import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Button from './Button';
import { getCategories } from '../services/productService';

const ProductSearch = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || '');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategories();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    
    const params = {};
    if (query.trim()) params.search = query;
    if (category) params.category = category;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;
    if (sort) params.sort = sort;

    setSearchParams(params);
  };

  const handleClear = () => {
    setQuery('');
    setCategory('');
    setMinPrice('');
    setMaxPrice('');
    setSort('');
    setSearchParams({});
  };

  return (
    <form onSubmit={handleSearch} className="bg-card-bg border border-sage-200 rounded-xl p-6 shadow-lg mb-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        {/* Búsqueda por texto */}
        <div className="col-span-1 md:col-span-2 lg:col-span-4">
          <div className="relative">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar productos..."
              className="w-full px-4 py-3 pl-10 bg-dark-bg border border-sage-200/50 rounded-lg text-gray-100 focus:outline-none focus:border-primary shadow-sm transition-all placeholder-gray-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Filtro por Categoría */}
        <div>
          <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Categoría</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 bg-dark-bg border border-sage-200/50 rounded-lg text-gray-100 focus:outline-none focus:border-primary appearance-none"
          >
            <option value="">Todas</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Rango de Precio */}
        <div>
          <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Precio</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Min"
              className="w-1/2 px-3 py-2 bg-dark-bg border border-sage-200/50 rounded-lg text-gray-100 focus:outline-none focus:border-primary"
            />
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Max"
              className="w-1/2 px-3 py-2 bg-dark-bg border border-sage-200/50 rounded-lg text-gray-100 focus:outline-none focus:border-primary"
            />
          </div>
        </div>

        {/* Ordenar por */}
        <div>
          <label className="block text-xs font-bold text-gray-400 mb-1 uppercase">Ordenar por</label>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="w-full px-3 py-2 bg-dark-bg border border-sage-200/50 rounded-lg text-gray-100 focus:outline-none focus:border-primary appearance-none"
          >
            <option value="">Defecto (Recientes)</option>
            <option value="price_asc">Precio: Menor a Mayor</option>
            <option value="price_desc">Precio: Mayor a Menor</option>
            <option value="name_asc">Nombre: A-Z</option>
            <option value="name_desc">Nombre: Z-A</option>
          </select>
        </div>

        {/* Botones */}
        <div className="flex gap-2 items-end">
          <Button type="submit" className="flex-1 py-2">
            Filtrar
          </Button>
          <button 
            type="button" 
            onClick={handleClear}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Limpiar
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProductSearch;
