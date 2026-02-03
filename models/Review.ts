import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReview extends Document {
    user: mongoose.Types.ObjectId;
    product: mongoose.Types.ObjectId;
    rating: number;
    comment: string;
    createdAt: Date;
}

const ReviewSchema: Schema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true, maxlength: 500 },
    },
    { timestamps: true }
);

// Prevent multiple reviews from same user on same product
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

const Review: Model<IReview> = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);

export default Review;
