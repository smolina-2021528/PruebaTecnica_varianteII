import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const movementSchema = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    productName: {
      type: String,
      required: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ['ENTRY', 'OUTPUT'],
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'La cantidad debe ser mayor a 0'],
      validate: {
        validator: Number.isInteger,
        message: 'La cantidad debe ser un número entero',
      },
    },
    previousStock: {
      type: Number,
      required: true,
      min: [0, 'El stock anterior debe ser mayor o igual a cero'],
    },
    newStock: {
      type: Number,
      required: true,
      min: [0, 'El stock nuevo debe ser mayor o igual a cero'],
    },
  },
  { timestamps: true },
);

export const Movement = model('Movement', movementSchema);