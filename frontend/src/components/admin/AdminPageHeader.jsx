import React from 'react';
import Button from '../Button';

const AdminPageHeader = ({ title, onCreate, createLabel }) => {
  return (
    <div className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-gray-100">{title}</h1>
      {onCreate && (
        <Button variant="primary" onClick={onCreate}>
          {createLabel || '+ Nuevo'}
        </Button>
      )}
    </div>
  );
};

export default AdminPageHeader;
