import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'La categoría es obligatoria'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'El precio es obligatorio'],
      min: [0, 'El precio debe ser mayor o igual a cero'],
    },
    stock: {
      type: Number,
      required: true,
      min: [0, 'El stock debe ser mayor o igual a cero'],
      default: 0,
    },
    minStock: {
      type: Number,
      required: true,
      min: [0, 'El stock mínimo debe ser mayor o igual a cero'],
      default: 5,
    },
  },
  {
    timestamps: true,
  },
);

// Índice para acelerar la búsqueda case-insensitive por nombre (Sprint 2).
productSchema.index({ name: 1 });
productSchema.index({ category: 1 });

export const Product = model('Product', productSchema);
