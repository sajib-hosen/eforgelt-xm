import { Model, Schema, model } from "mongoose";
import { TUser } from "./user.interface";
import config from "../../config";
import bcrypt from "bcrypt";

type UserModel = Model<TUser, object>;

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
      select: 0,
    },
    age: {
      type: Number,
      required: true,
    },
    district: {
      type: String,
      required: true,
    },
    lastDonationDate: {
      type: String,
    },
    donationAvailability: {
      type: Boolean,
      required: true,
      default: true,
    },
    bloodGroup: {
      type: String,
      required: true,
    },
    points: {
      type: Number,
      required: true,
      min: 0,
      default: 2,
    },
    refreshToken: {
      type: String,
      default: null,
    },
    otp: {
      type: Number,
      default: null,
    },
    otpExpiresAt: {
      type: Date,
      default: null,
    },
    lastSeenAt: {
      type: Date,
      default: Date.now,
    },

    donationHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "BloodPost",
      },
    ],
    postHistory: [
      {
        type: Schema.Types.ObjectId,
        ref: "BloodPost",
      },
    ],
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
    strictPopulate: false,
  }
);

userSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  try {
    user.password = await bcrypt.hash(
      user.password,
      Number(config.bcrypt_salt_rounds)
    );
    next();
  } catch (err) {
    next(err as any);
  }
});

export const User = model<TUser, UserModel>("User", userSchema);
