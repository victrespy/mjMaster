import React, { useState, useEffect } from 'react';
import Button from '../Button';
import { getCategories } from '../../services/categoryService';
import { uploadImage } from '../../services/uploadService';

const ProductForm = ({ product, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    picture: '/products/placeholder.avif' // Valor por defecto
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      // getCategories ahora devuelve { items: [], totalItems: X }
      const data = await getCategories(1, 100);
      setCategories(data.items || []);
    };
    loadCategories();

    if (product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        stock: product.stock || '',
        category: product.category ? product.category['@id'] : '',
        picture: product.picture || '/products/placeholder.avif'
      });
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const url = await uploadImage(file);
      setFormData(prev => ({ ...prev, picture: url }));
    } catch (error) {
      alert('Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    const dataToSend = {
      ...formData,
      price: String(formData.price),
      stock: parseInt(formData.stock),
    };

    await onSubmit(dataToSend);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-card-bg border border-sage-200 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="p-6 border-b border-sage-200 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-primary">
            {product ? 'Editar Producto' : 'Nuevo Producto'}
          </h2>
          <button onClick={onCancel} className="text-gray-400 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Columna Izquierda: Datos */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-300 mb-1">Nombre</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-sage-50 border border-sage-200 rounded px-3 py-2 text-gray-100 focus:border-primary focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-1">Categoría</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full bg-sage-50 border border-sage-200 rounded px-3 py-2 text-gray-100 focus:border-primary focus:outline-none"
                  required
                >
                  <option value="">Seleccionar...</option>
                  {categories.map(cat => (
                    <option key={cat.id} value={cat['@id']}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-1">Precio (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full bg-sage-50 border border-sage-200 rounded px-3 py-2 text-gray-100 focus:border-primary focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-300 mb-1">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    className="w-full bg-sage-50 border border-sage-200 rounded px-3 py-2 text-gray-100 focus:border-primary focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-300 mb-1">Descripción</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full bg-sage-50 border border-sage-200 rounded px-3 py-2 text-gray-100 focus:border-primary focus:outline-none"
                ></textarea>
              </div>
            </div>

            {/* Columna Derecha: Imagen */}
            <div className="space-y-4">
              <label className="block text-sm font-bold text-gray-300 mb-1">Imagen del Producto</label>

              <div className="border-2 border-dashed border-sage-200 rounded-lg p-4 flex flex-col items-center justify-center bg-sage-50/5 hover:bg-sage-50/10 transition-colors relative">
                {uploading ? (
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                ) : (
                  <img
                    src={formData.picture}
                    alt="Preview"
                    className="h-48 w-full object-contain rounded mb-4"
                    onError={(e) => e.target.src = '/products/placeholder.avif'}
                  />
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <div className="text-center pointer-events-none">
                  <p className="text-sm text-primary font-bold">Haz clic para subir imagen</p>
                  <p className="text-xs text-gray-500">JPG, PNG, WEBP</p>
                </div>
              </div>

              <div className="text-xs text-gray-500 text-center">
                Ruta actual: {formData.picture}
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-sage-200/30">
            <Button type="button" variant="secondary" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" variant="primary" disabled={loading || uploading}>
              {loading ? 'Guardando...' : 'Guardar Producto'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
