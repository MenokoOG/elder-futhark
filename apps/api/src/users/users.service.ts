import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserDocument } from "./user.schema";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  async createUser(input: { email: string; passwordHash: string; handle: string }) {
    const doc = new this.userModel(input);
    return doc.save();
  }

  async safeProfile(userId: string) {
    const u = await this.userModel.findById(userId).exec();
    if (!u) return null;
    return { id: String(u._id), email: u.email, handle: u.handle };
  }
}