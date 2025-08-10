import { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: "student" | "admin" | "supervisor";
  createdAt: Date;
  updatedAt: Date;
  isVerified: boolean;
}
