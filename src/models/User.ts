import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  passwordHash: string;
  name: string;
  email: string;
}

const UserSchema: Schema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', UserSchema);