import { injectable } from 'inversify';
import { OffenseDocument, OffenseModel } from '../models/offense.schema';

@injectable()
export class OffenseRepository {
    async create(doc: Partial<OffenseDocument>) {
        const m = new OffenseModel(doc);
        return m.save();
    }

    async findById(id: string) {
        return OffenseModel.findById(id, { __v: 0 }).exec();
    }

    async findAllByUser(userId: string) {
        return OffenseModel.find({ user: userId }, { __v: 0 }).sort({ createdAt: -1 }).exec();
    }

    async deleteById(id: string) {
        return OffenseModel.findByIdAndDelete(id, { projection: { __v: 0 } }).exec();
    }

    async updateById(id: string, patch: Partial<OffenseDocument>) {
        return OffenseModel.findByIdAndUpdate(id, patch, { new: true, projection: { __v: 0 } }).exec();
    }

    async findAll() {
        return OffenseModel.find({}, { __v: 0 }).sort({ createdAt: -1 }).exec();
    }
}