import mongoose, { Document, Types } from 'mongoose';

export interface UserDocument extends Document {
    _id: Types.ObjectId;
    name: string;
    email: string;
    passwordHash: string;
}

const UserSchema = new mongoose.Schema<UserDocument>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
}, { timestamps: true });

UserSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

export const UserModel = mongoose.model<UserDocument>('User', UserSchema);
