import React, { useEffect, useState } from 'react';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../../services/productService';
import ProductForm from '../../components/admin/ProductForm';
import AdminTable from '../../components/admin/AdminTable';
import AdminPageHeader from '../../components/admin/AdminPageHeader';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // Paginación y Filtros
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 8;
  const [searchTerm, setSearchTerm] = useState('');

  const API_BASE_URL = "https://localhost:9443";

  const getImageUrl = (path) => {
    if (!path) return '/products/placeholder.avif';
    if (path.startsWith('http')) return path;
    return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadProducts(currentPage, searchTerm);
    }, 300); // Debounce de 300ms para no saturar la API

    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, searchTerm]);

  const loadProducts = async (page = 1, name = '') => {
    try {
      setLoading(true);
      const data = await getProducts(page, itemsPerPage, { name });
      setProducts(data.items || []);
      setTotalItems(data.totalItems || 0);
    } catch (error) {
      console.error("Error cargando productos:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
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
        loadProducts(currentPage, searchTerm);
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
      loadProducts(currentPage, searchTerm);
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

      {/* Barra de Búsqueda */}
      <div className="mb-6 bg-card-bg p-4 rounded-xl border border-sage-200 shadow-sm">
        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-xs font-bold text-gray-400 uppercase">Buscar por Nombre</label>
          <input 
            type="text"
            placeholder="Escribe el nombre del producto..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-dark-bg border border-sage-200/30 rounded-lg text-sm text-gray-200 p-2 outline-none focus:border-primary w-full"
          />
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
