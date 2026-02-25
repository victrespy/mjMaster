import React, { useEffect, useState } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../services/productService';
import { getCategories } from '../../services/categoryService';
import ProductForm from '../../components/admin/ProductForm';
import AdminTable from '../../components/admin/AdminTable';
import AdminPageHeader from '../../components/admin/AdminPageHeader';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Paginación y Filtros
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 8;
  
  const [filters, setFilters] = useState({
    name: '',
    categoryName: '',
    stockOp: 'gte', // gte (>=), lte (<=), gt (>), lt (<), eq (=)
    stockValue: ''
  });

  const API_BASE_URL = "https://localhost:9443";

  const getImageUrl = (path) => {
    if (!path) return '/products/placeholder.avif';
    if (path.startsWith('http')) return path;
    return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const catData = await getCategories(1, 100);
        setCategories(catData.items || []);
      } catch (error) {
        console.error("Error cargando categorías iniciales:", error);
      }
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadProducts(currentPage, filters);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, filters]);

  const loadProducts = async (page = 1, currentFilters = {}) => {
    try {
      setLoading(true);
      const data = await getProducts(page, itemsPerPage, currentFilters);
      setProducts(data.items || []);
      setTotalItems(data.totalItems || 0);
    } catch (error) {
      console.error("Error cargando productos:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este producto?')) {
      try {
        await deleteProduct(id);
        loadProducts(currentPage, filters);
      } catch (error) {
        alert('Error al eliminar producto');
      }
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, data);
      } else {
        await createProduct(data);
      }
      setShowForm(false);
      loadProducts(currentPage, filters);
    } catch (error) {
      alert(error.message);
    }
  };

  const columns = [
    { 
      header: 'Imagen', 
      render: (product) => (
        <div className="h-10 w-10 rounded bg-sage-200 overflow-hidden">
          <img 
            src={getImageUrl(product.picture)} 
            alt="" 
            className="h-full w-full object-cover"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/products/placeholder.avif';
            }}
          />
        </div>
      )
    },
    { header: 'Nombre', accessor: 'name', className: 'font-medium text-gray-200' },
    { 
      header: 'Categoría', 
      render: (product) => (
        <span className="px-2 py-1 bg-sage-100/30 text-sage-300 rounded text-xs border border-sage-200/30">
          {product.category ? product.category.name : 'Sin categoría'}
        </span>
      )
    },
    { 
      header: 'Precio', 
      render: (product) => <span className="text-primary font-bold">{parseFloat(product.price).toFixed(2)} €</span> 
    },
    { 
      header: 'Stock', 
      render: (product) => (
        <span className={`px-2 py-1 rounded text-xs font-bold ${product.stock > 0 ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'}`}>
          {product.stock} uds
        </span>
      )
    },
  ];

  return (
    <div>
      <AdminPageHeader 
        title="Gestión de Productos" 
        onCreate={handleCreate} 
        createLabel="+ Nuevo Producto" 
      />

      {/* Barra de Filtros Avanzada */}
      <div className="mb-6 bg-card-bg p-4 rounded-xl border border-sage-200 shadow-sm flex flex-wrap gap-4">
        {/* Búsqueda por Nombre */}
        <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
          <label className="text-xs font-bold text-gray-400 uppercase">Nombre</label>
          <input 
            type="text"
            name="name"
            placeholder="Buscar producto..."
            value={filters.name}
            onChange={handleFilterChange}
            className="bg-dark-bg border border-sage-200/30 rounded-lg text-sm text-gray-200 p-2 outline-none focus:border-primary w-full"
          />
        </div>

        {/* Filtro por Categoría */}
        <div className="flex flex-col gap-1 min-w-[180px]">
          <label className="text-xs font-bold text-gray-400 uppercase">Categoría</label>
          <select 
            name="categoryName"
            value={filters.categoryName}
            onChange={handleFilterChange}
            className="bg-dark-bg border border-sage-200/30 rounded-lg text-sm text-gray-200 p-2 outline-none focus:border-primary w-full"
          >
            <option value="">TODAS</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Filtro por Stock */}
        <div className="flex flex-col gap-1 min-w-[220px]">
          <label className="text-xs font-bold text-gray-400 uppercase">Filtrar Stock</label>
          <div className="flex gap-2">
            <select 
              name="stockOp"
              value={filters.stockOp}
              onChange={handleFilterChange}
              className="bg-dark-bg border border-sage-200/30 rounded-lg text-sm text-gray-200 p-2 outline-none focus:border-primary w-24"
            >
              <option value="eq">=</option>
              <option value="gt">&gt;</option>
              <option value="gte">&ge;</option>
              <option value="lt">&lt;</option>
              <option value="lte">&le;</option>
            </select>
            <input 
              type="number"
              name="stockValue"
              placeholder="Cant."
              value={filters.stockValue}
              onChange={handleFilterChange}
              className="bg-dark-bg border border-sage-200/30 rounded-lg text-sm text-gray-200 p-2 outline-none focus:border-primary w-full"
            />
          </div>
        </div>
      </div>

      <AdminTable
        columns={columns}
        data={products}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={(page) => setCurrentPage(page)}
      />

      {showForm && (
        <ProductForm 
          product={editingProduct} 
          onSubmit={handleSubmit} 
          onCancel={() => setShowForm(false)} 
        />
      )}
    </div>
  );
};

export default AdminProducts;
