import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IWebhookLog extends Document {
    provider: string;
    payload: any;
    headers: any;
    error?: string;
    createdAt: Date;
}

const WebhookLogSchema: Schema = new Schema(
    {
        provider: { type: String, required: true },
        payload: { type: Schema.Types.Mixed },
        headers: { type: Schema.Types.Mixed },
        error: { type: String },
    },
    { timestamps: true }
);

const WebhookLog: Model<IWebhookLog> = mongoose.models.WebhookLog || mongoose.model<IWebhookLog>('WebhookLog', WebhookLogSchema);

export default WebhookLog;
