import { Types } from "mongoose";

export type TUser = {
  name: string;
  email: string;
  password: string;
  isVerified: boolean;
  age: number;
  district: string;
  lastDonationDate: string;
  donationAvailability: boolean;
  bloodGroup: string;
  points: number;
  refreshToken: string | null;
  otp: number | null;
  otpExpiresAt: Date | null;
  lastSeenAt: Date;
  donationHistory: [Types.ObjectId];
  postHistory: [Types.ObjectId];
  cancelHistory: [Types.ObjectId];
  friends: [Types.ObjectId];
};
