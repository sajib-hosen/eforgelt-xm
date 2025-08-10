import jwt from "jsonwebtoken";

/**
 * Generates access and refresh tokens for a user.
 *
 * @param payload - The payload to embed in the tokens (e.g., user id, role).
 * @returns An object containing accessToken and refreshToken.
 */
export const generateTokens = (payload: object) => {
  // Generate Access Token (1 hour)
  const accessToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "1h",
  });

  // Generate Refresh Token (7 days)
  const refreshToken = jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET as string,
    { expiresIn: "7d" }
  );

  return { accessToken, refreshToken };
};
