import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
    name?: string;
    email: string;
    image?: string;
    role: 'user' | 'admin';
    provider: 'credentials' | 'google';
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        name: { type: String },
        email: { type: String, required: true, unique: true },
        password: { type: String, select: false }, // Only for credentials
        image: { type: String },
        role: { type: String, enum: ['user', 'admin'], default: 'user' },
        provider: { type: String, default: 'credentials' },
    },
    { timestamps: true }
);

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);

export default User;
