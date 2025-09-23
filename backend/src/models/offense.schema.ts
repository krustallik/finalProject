import mongoose, { Document, Types } from 'mongoose';

export interface OffenseDocument extends Document {
    _id: Types.ObjectId;
    user: Types.ObjectId; // ref User
    description: string;
    category?: string;
    photoUrl?: string;
    photoId?: string;
    latitude?: number;
    longitude?: number;
    createdAt: Date;
}

const OffenseSchema = new mongoose.Schema<OffenseDocument>(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        description: { type: String, required: true },
        category: { type: String },
        photoUrl: { type: String },
        photoId: { type: String },
        latitude: { type: Number },
        longitude: { type: Number },
        createdAt: { type: Date, required: true },
    },
    { timestamps: true }
);

OffenseSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

OffenseSchema.index({ user: 1, createdAt: -1 });

export const OffenseModel = mongoose.model<OffenseDocument>('Offense', OffenseSchema);