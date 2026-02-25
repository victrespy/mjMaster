import React, { useEffect, useState } from 'react';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/categoryService';
import CategoryForm from '../../components/admin/CategoryForm';
import AdminTable from '../../components/admin/AdminTable';
import AdminPageHeader from '../../components/admin/AdminPageHeader';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  const API_BASE_URL = "https://localhost:9443";

  const getImageUrl = (path) => {
    if (!path) return '/products/placeholder.avif';
    if (path.startsWith('http')) return path;
    return `${API_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  useEffect(() => {
    loadCategories(currentPage);
  }, [currentPage]);

  const loadCategories = async (page = 1) => {
    try {
      setLoading(true);
      const data = await getCategories(page, itemsPerPage);
      setCategories(data.items || []);
      setTotalItems(data.totalItems || 0);
    } catch (error) {
      console.error("Error cargando categorías:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingCategory(null);
    setShowForm(true);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro? Esto podría afectar a los productos asociados.')) {
      try {
        await deleteCategory(id);
        loadCategories(currentPage);
      } catch (error) {
        alert('Error al eliminar categoría');
      }
    }
  };

  const handleSubmit = async (data) => {
    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, data);
      } else {
        await createCategory(data);
      }
      setShowForm(false);
      loadCategories(currentPage);
    } catch (error) {
      alert(error.message);
    }
  };

  const columns = [
    { header: 'ID', accessor: 'id', className: 'text-gray-400 w-20' },
    { 
      header: 'Imagen', 
      render: (category) => (
        <div className="h-10 w-10 rounded bg-sage-200 overflow-hidden">
          <img 
            src={getImageUrl(category.picture)} 
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
  ];

  return (
    <div>
      <AdminPageHeader 
        title="Gestión de Categorías" 
        onCreate={handleCreate} 
        createLabel="+ Nueva Categoría" 
      />

      <AdminTable 
        columns={columns}
        data={categories}
        loading={loading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={(page) => setCurrentPage(page)}
      />

      {showForm && (
        <CategoryForm 
          category={editingCategory} 
          onSubmit={handleSubmit} 
          onCancel={() => setShowForm(false)} 
        />
      )}
    </div>
  );
};

export default AdminCategories;
