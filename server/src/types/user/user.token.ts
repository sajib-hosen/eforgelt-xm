import { Document } from "mongoose";

export interface IUserToken extends Document {
  type: string;
  email: string;
  isUsed: boolean;
  tokenId: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
