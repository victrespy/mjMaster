import React, { useEffect, useState } from 'react';
import { getReviews, deleteReview } from '../../services/reviewService';
import AdminTable from '../../components/admin/AdminTable';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import StarsDisplay from '../../components/StarsDisplay';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Paginación y Filtros
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 7;
  const [filters, setFilters] = useState({
    productName: '',
    userName: '',
    rating: ''
  });

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      loadReviews(currentPage, filters);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, filters]);

  const loadReviews = async (page = 1, currentFilters = {}) => {
    try {
      setLoading(true);
      const data = await getReviews(page, itemsPerPage, currentFilters);
      setReviews(data.items || []);
      setTotalItems(data.totalItems || 0);
    } catch (error) {
      console.error("Error cargando reseñas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta reseña?')) {
      try {
        await deleteReview(id);
        loadReviews(currentPage, filters);
      } catch (error) {
        alert('Error al eliminar reseña');
      }
    }
  };

  const columns = [
    { header: 'ID', accessor: 'id', className: 'text-gray-400 w-16' },
    { 
      header: 'Producto', 
      render: (review) => (
        <span className="font-medium text-primary">
          {review.product ? review.product.name : 'Producto Eliminado'}
        </span>
      )
    },
    { 
      header: 'Usuario', 
      render: (review) => (
        <span className="text-gray-300">
          {review.authorName || (review.user ? review.user.name : 'Anónimo')}
        </span>
      )
    },
    { 
      header: 'Rating', 
      render: (review) => (
        <StarsDisplay value={review.rating} size="w-3 h-3" />
      )
    },
    { 
      header: 'Comentario', 
      accessor: 'comment', 
      className: 'text-gray-400 text-sm max-w-xs truncate' 
    },
    { 
      header: 'Fecha', 
      render: (review) => new Date(review.createdAt).toLocaleDateString() 
    },
  ];

  return (
    <div>
      <AdminPageHeader title="Gestión de Reseñas" />

      {/* Barra de Filtros */}
      <div className="mb-6 bg-card-bg p-4 rounded-xl border border-sage-200 shadow-sm flex flex-wrap gap-4">
        <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
          <label className="text-xs font-bold text-gray-400 uppercase">Producto</label>
          <input 
            type="text"
            name="productName"
            placeholder="Nombre del producto..."
            value={filters.productName}
            onChange={handleFilterChange}
            className="bg-dark-bg border border-sage-200/30 rounded-lg text-sm text-gray-200 p-2 outline-none focus:border-primary w-full"
          />
        </div>

        <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
          <label className="text-xs font-bold text-gray-400 uppercase">Usuario</label>
          <input 
            type="text"
            name="userName"
            placeholder="Nombre del usuario..."
            value={filters.userName}
            onChange={handleFilterChange}
            className="bg-dark-bg border border-sage-200/30 rounded-lg text-sm text-gray-200 p-2 outline-none focus:border-primary w-full"
          />
        </div>

        <div className="flex flex-col gap-1 min-w-[150px]">
          <label className="text-xs font-bold text-gray-400 uppercase">Rating</label>
          <select 
            name="rating"
            value={filters.rating}
            onChange={handleFilterChange}
            className="bg-dark-bg border border-sage-200/30 rounded-lg text-sm text-gray-200 p-2 outline-none focus:border-primary w-full"
          >
            <option value="">TODOS</option>
            <option value="5">5 Estrellas</option>
            <option value="4">4 Estrellas</option>
            <option value="3">3 Estrellas</option>
            <option value="2">2 Estrellas</option>
            <option value="1">1 Estrella</option>
          </select>
        </div>
      </div>

      <AdminTable 
        columns={columns}
        data={reviews}
        loading={loading}
        onDelete={handleDelete}
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
};

export default AdminReviews;
