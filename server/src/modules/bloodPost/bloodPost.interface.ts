import { Types } from "mongoose";

export type TBloodPost = {
  bloodGroup: "A+" | " A-" | "B+" | "B-" | "O+" | "O-" | "AB+" | "AB-";
  district: string;
  address: string;
  time: string;
  contact: string;
  patientName: string;
  note: string;
  noOfBags: number;
  accepted: number;
  status: "pending" | "donated" | "cancelled";
  postCreator: Types.ObjectId;
  phoneNumberOpened: [
    {
      user: Types.ObjectId;
      phoneStatus: boolean;
    }
  ];
};
