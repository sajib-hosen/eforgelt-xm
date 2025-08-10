import { Schema, model } from "mongoose";
import * as bcrypt from "bcrypt";
import { IUser } from "../types/user/user.types";
import { SALT_ROUND } from "../utils/constants";
// import { IUser } from "../../types/user/user.types";

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      enum: ["student", "admin", "supervisor"],
      default: "student",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(SALT_ROUND);
  this.password = await bcrypt.hash(this.password as string, salt);
  next();
});

export const User = model<IUser>("User", userSchema);
