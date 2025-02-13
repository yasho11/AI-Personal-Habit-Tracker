import mongoose, { Document, Schema } from "mongoose";

export interface IUsers extends Document {
  UserName: string;
  UserEmail: string;
  UserPassword: string;
  Points: number;
  ProfileUrl?: string;
  resetToken: string;
  resetTokenExpiry: Date;
}

const UserSchema: Schema = new Schema({
  UserName: {
    type: String,
    required: true,
  },
  UserEmail: {
    type: String,
    required: true,
  },
  UserPassword: {
    type: String,
    required: true,
  },
  Points: {
    type: Number,
    required: true,
  },
  ProfileUrl: {
    type: String,
    required: true,
  },
  resetToken: {
    type: String,
    required: false,
  },
  resetTokenExpiry: {
    type: Date,
    required: false,
  },
});

export default mongoose.model<IUsers>("Users", UserSchema);
