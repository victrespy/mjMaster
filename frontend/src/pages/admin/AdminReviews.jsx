import React, { useEffect, useState } from 'react';
import { getReviews, deleteReview } from '../../services/reviewService';
import AdminTable from '../../components/admin/AdminTable';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import StarsDisplay from '../../components/StarsDisplay';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await getReviews(1, 50);
      setReviews(data.items);
    } catch (error) {
      console.error("Error cargando reseñas:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta reseña?')) {
      try {
        await deleteReview(id);
        loadReviews();
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

      <AdminTable 
        columns={columns}
        data={reviews}
        loading={loading}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default AdminReviews;
