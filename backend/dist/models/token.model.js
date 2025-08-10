"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserToken = void 0;
const mongoose_1 = require("mongoose");
const tokenSchema = new mongoose_1.Schema({
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
}, {
    timestamps: true,
});
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
exports.UserToken = (0, mongoose_1.model)("token1", tokenSchema);
