import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import useMediaQuery from '../../hooks/useMediaQuery';
import AccordionView from './AccordionView';

const AdminTable = ({ 
  columns, 
  data = [], 
  loading, 
  onEdit, 
  onDelete, 
  actions,
  currentPage = 1,
  totalItems = 0,
  itemsPerPage = 10,
  onPageChange,
  mobileHeader // Prop para definir el contenido del header en móvil
}) => {
  const location = useLocation();
  
  // Determinar el breakpoint según la ruta
  const getBreakpoint = (path) => {
    // Normalizamos la ruta quitando slashes finales o query params si fuera necesario
    const currentPath = path.toLowerCase();

    if (currentPath.includes('/admin/products')) return '(max-width: 1090px)'; // Tabla ancha
    if (currentPath.includes('/admin/orders')) return '(max-width: 1180px)';   // Tabla ancha
    if (currentPath.includes('/admin/reviews')) return '(max-width: 1495px)';  // Tabla muy ancha (comentarios)
    if (currentPath.includes('/admin/users')) return '(max-width: 1045px)';     // Tabla media
    if (currentPath.includes('/admin/categories')) return '(max-width: 640px)'; // Tabla estrecha
    if (currentPath.includes('/profile')) return '(max-width: 768px)';          // Perfil de usuario
    
    return '(max-width: 768px)'; // Default
  };

  const breakpoint = getBreakpoint(location.pathname);
  const isMobile = useMediaQuery(breakpoint);

  const [openRowIndex, setOpenRowIndex] = useState(null);

  const totalItemsNum = parseInt(totalItems, 10) || 0;
  const totalPages = Math.ceil(totalItemsNum / itemsPerPage) || 1;

  const handleToggle = (index) => {
    setOpenRowIndex(openRowIndex === index ? null : index);
  };

  const renderMobileHeader = (item) => {
    if (typeof mobileHeader === 'function') {
      return mobileHeader(item);
    }
    if (typeof mobileHeader === 'string' && item[mobileHeader]) {
      return item[mobileHeader];
    }
    // Fallback: usa la primera columna
    const firstCol = columns[0];
    if (!firstCol) return 'Item';
    return firstCol.render ? firstCol.render(item) : item[firstCol.accessor];
  };

  return (
    <div className="bg-card-bg border border-sage-200 rounded-xl shadow-lg overflow-hidden">
      {isMobile ? (
        // Vista Móvil (Accordion)
        <div className="divide-y divide-gray-700">
          {loading ? (
             <div className="p-8 text-center text-gray-400">
                <div className="flex justify-center items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary"></div>
                  Cargando datos...
                </div>
             </div>
          ) : data.length === 0 ? (
             <div className="p-8 text-center text-gray-400">No hay registros disponibles.</div>
          ) : (
            data.map((item, index) => (
              <AccordionView
                key={item.id || index}
                headerContent={renderMobileHeader(item)}
                isOpen={openRowIndex === index}
                onToggle={() => handleToggle(index)}
              >
                <div className="space-y-3">
                  {columns.map((col, colIndex) => (
                    <div key={colIndex} className="flex flex-col">
                      <span className="text-xs uppercase text-gray-500 font-bold">{col.header}</span>
                      <span className="text-sm text-gray-300 break-words">
                        {col.render ? col.render(item) : item[col.accessor]}
                      </span>
                    </div>
                  ))}
                  
                  {(onEdit || onDelete || actions) && (
                    <div className="pt-4 flex gap-3 justify-end border-t border-gray-700 mt-2">
                      {actions && actions(item)}
                      {onEdit && (
                        <button 
                          onClick={() => onEdit(item)}
                          className="px-3 py-1 bg-blue-900/30 text-blue-400 rounded border border-blue-800 hover:bg-blue-900/50 text-sm transition-colors"
                        >
                          Editar
                        </button>
                      )}
                      {onDelete && (
                        <button 
                          onClick={() => onDelete(item.id)}
                          className="px-3 py-1 bg-red-900/30 text-red-400 rounded border border-red-800 hover:bg-red-900/50 text-sm transition-colors"
                        >
                          Borrar
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </AccordionView>
            ))
          )}
        </div>
      ) : (
        // Vista Escritorio (Tabla original)
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-sage-100/50 text-gray-300 uppercase text-xs font-bold">
              <tr>
                {columns.map((col, index) => (
                  <th key={index} className={`px-6 py-4 ${col.className || ''}`}>
                    {col.header}
                  </th>
                ))}
                {(onEdit || onDelete || actions) && (
                  <th className="px-6 py-4 text-center">Acciones</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-sage-200/50">
              {loading ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-6 py-8 text-center text-gray-400">
                    <div className="flex justify-center items-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-primary"></div>
                      Cargando datos...
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={columns.length + 1} className="px-6 py-8 text-center text-gray-400">
                    No hay registros disponibles.
                  </td>
                </tr>
              ) : (
                data.map((item, rowIndex) => (
                  <tr key={item.id || rowIndex} className="hover:bg-sage-50/5 transition-colors">
                    {columns.map((col, colIndex) => (
                      <td key={colIndex} className={`px-6 py-4 ${col.className || ''}`}>
                        {col.render ? col.render(item) : item[col.accessor]}
                      </td>
                    ))}
                    
                    {(onEdit || onDelete || actions) && (
                      <td className="px-6 py-4 text-right space-x-2">
                        {actions && actions(item)}
                        
                        {onEdit && (
                          <button 
                            onClick={() => onEdit(item)}
                            className="text-blue-400 hover:text-blue-300 font-medium text-sm transition-colors"
                          >
                            Editar
                          </button>
                        )}
                        
                        {onDelete && (
                          <button 
                            onClick={() => onDelete(item.id)}
                            className="text-red-400 hover:text-red-300 font-medium text-sm transition-colors"
                          >
                            Borrar
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Barra de Paginación */}
      {totalItemsNum > 0 && (
        <div className="px-6 py-4 bg-sage-100/30 border-t border-sage-200/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-400 text-center sm:text-left">
            Mostrando <span className="font-medium text-gray-200">{data.length}</span> de <span className="font-medium text-gray-200">{totalItemsNum}</span> resultados
          </div>
          
          {onPageChange && totalPages > 1 && (
            <div className="flex gap-2">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className="px-3 py-1 rounded border border-sage-200 text-gray-300 hover:bg-sage-200/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                Anterior
              </button>
              <span className="px-3 py-1 text-gray-200 font-medium text-sm flex items-center">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
                className="px-3 py-1 rounded border border-sage-200 text-gray-300 hover:bg-sage-200/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm"
              >
                Siguiente
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminTable;
