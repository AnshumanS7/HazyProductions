import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrder extends Document {
    userId: mongoose.Types.ObjectId;
    stripeSessionId: string;
    amount: number;
    currency: string;
    status: 'pending' | 'completed' | 'failed';
    items: mongoose.Types.ObjectId[]; // Array of Product IDs
    customerEmail: string;
    createdAt: Date;
    updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User' }, // Optional if guest checkout allowed, but typically required for digital goods
        stripeSessionId: { type: String, required: true, unique: true },
        amount: { type: Number, required: true },
        currency: { type: String, default: 'usd' },
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed'],
            default: 'pending'
        },
        items: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
        customerEmail: { type: String, required: true },
    },
    { timestamps: true }
);

const Order: Model<IOrder> = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
