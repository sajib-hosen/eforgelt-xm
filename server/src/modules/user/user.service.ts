// import { UserToken } from "../../models/token.model";
import { User } from "../../models/user.model";
// import { IUserToken } from "../../types/user/user.token";
import { IUser } from "../../types/user/user.types";
// import mongoose from "mongoose";

export const createUser = async (userData: Partial<IUser>): Promise<IUser> => {
  const user = new User(userData);
  return user.save();
};

export const findUserByEmail = async (email: string): Promise<IUser | null> => {
  return User.findOne({ email }).select("+password");
};

// export const findUserById = async (id: string) => {
//   return User.findById(id);
// };

// export const createUserToken = async (
//   tokenData: Partial<IUserToken>
// ): Promise<IUserToken> => {
//   const userToken = new UserToken(tokenData);
//   return userToken.save();
// };

// export const findUserTokenById = async (
//   tokenId: string
// ): Promise<IUserToken | null> => {
//   if (!mongoose.Types.ObjectId.isValid(tokenId)) {
//     return null;
//   }

//   return UserToken.findOne({ _id: tokenId });
// };

// export const verifyUserEmail = async (
//   userId: string
// ): Promise<IUser | null> => {
//   return User.findByIdAndUpdate(userId, { isVerified: true }, { new: true });
// };

// export const updateUserToken = async (
//   tokenId: string,
//   updateData: Partial<IUserToken>
// ): Promise<IUserToken | null> => {
//   return UserToken.findByIdAndUpdate(tokenId, updateData, {
//     new: true,
//   });
// };
