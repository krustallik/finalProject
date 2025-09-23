import {UserDocument, UserModel} from "../models/user.schema";
import {RegisterDto, UpdateUserDto} from "../dtos/user.dto";
import {injectable} from "inversify";

@injectable()
export class UserRepository {
    async findAll(): Promise<UserDocument[]> {
        return UserModel.find({}, {__v: 0}).exec();
    }

    async findById(id: string): Promise<UserDocument | null> {
        return UserModel.findById(id, {__v: 0}).exec();
    }


    async update(id: string, dto: UpdateUserDto): Promise<UserDocument | null> {
        return UserModel.findByIdAndUpdate(id, dto, {new: true, projection: {__v: 0}}).exec();
    }

    async delete(id: string): Promise<UserDocument | null> {
        return UserModel.findByIdAndDelete(id, {projection: {__v: 0}}).exec();
    }
    async findByEmail(email: string) {
        return UserModel.findOne({ email }, { __v: 0 }).exec();
    }

    async createWithHash(doc: { name: string; email: string; passwordHash: string }) {
        const user = new UserModel(doc);
        return user.save();
    }
}