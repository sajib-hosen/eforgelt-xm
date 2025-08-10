import jwt from "jsonwebtoken";

export const createToken = (
  payload: { name: string; email: string },
  secret: string,
  expiresIn: string
) => {
  return jwt.sign(payload, secret, { expiresIn });
};
