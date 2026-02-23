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

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts(1, 100);
      setProducts(data);
    } catch (error) {
      console.error("Error cargando productos:", error);
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
        loadProducts();
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
      loadProducts();
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
            src={product.picture || '/products/placeholder.avif'} 
            alt="" 
            className="h-full w-full object-cover"
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

      <AdminTable 
        columns={columns}
        data={products}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
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
