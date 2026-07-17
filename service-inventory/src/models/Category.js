import mongoose from 'mongoose';

const { Schema, model } = mongoose;

const categorySchema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'El nombre de la categoría es obligatorio'],
            trim: true,
            unique: true,
        },
    },
    { timestamps: true }
);

export const Category = model('Category', categorySchema);