import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
    title: string;
    description: string;
    price: number;
    category: string;
    tags: string[];
    images: string[];
    fileKey: string; // S3 Key for the digital asset
    mediaType: 'ebook' | 'sfx' | 'template';
    previewUrl?: string; // Public preview (watermarked or snippet)
    isFeatured: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema: Schema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        category: { type: String, required: true },
        tags: { type: [String], default: [] },
        images: { type: [String], default: [] }, // Array of image URLs
        fileKey: { type: String, required: true, select: false }, // Hidden by default for security
        mediaType: {
            type: String,
            enum: ['ebook', 'sfx', 'template'],
            required: true
        },
        previewUrl: { type: String },
        isFeatured: { type: Boolean, default: false },
    },
    { timestamps: true }
);

// Check if model already exists to prevent overwrite error during hot reload
const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
