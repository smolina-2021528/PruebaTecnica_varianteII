import React from 'react';
import Modal from '../common/Modal';
import ProductForm from './ProductForm';

const ProductModal = ({ isOpen, onClose, title, product, categories, onSubmit }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <ProductForm
        product={product}
        categories={categories}
        onSubmit={onSubmit}
        onCancel={onClose}
      />
    </Modal>
  );
};

export default ProductModal;
