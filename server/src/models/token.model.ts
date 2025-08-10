import { Schema, model } from "mongoose";
import { IUserToken } from "../types/user/user.token";

const tokenSchema = new Schema<IUserToken>(
  {
    type: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    isUsed: {
      type: Boolean,
      required: true,
      select: false,
    },
    expiresAt: {
      type: Date,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// tokenSchema.pre<UserToken>("save", async function (next) {
//   if (!this.isModified("password")) {
//     return next();
//   }
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password as string, salt);
//   next();
// });

// tokenSchema.index({ email: 1, type: 1 }, { unique: true }); // compound unique index
tokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // TTL index

export const UserToken = model<IUserToken>("token1", tokenSchema);
