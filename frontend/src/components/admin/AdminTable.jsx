import React from 'react';

const AdminTable = ({ columns, data, loading, onEdit, onDelete, actions }) => {
  return (
    <div className="bg-card-bg border border-sage-200 rounded-xl shadow-lg overflow-hidden">
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
                <th className="px-6 py-4 text-right">Acciones</th>
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
    </div>
  );
};

export default AdminTable;
