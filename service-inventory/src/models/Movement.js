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
        },
        type: {
            type: String,
            enum: ['ENTRY', 'OUTPUT'],
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        previousStock: { type: Number, required: true },
        newStock: { type: Number, required: true },
    },
    { timestamps: true }
);

export const Movement = model('Movement', movementSchema);