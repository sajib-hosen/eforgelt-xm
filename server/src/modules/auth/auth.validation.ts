import { z } from "zod";

const loginValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Name is required" }),
    password: z.string({ required_error: "Password is required" }),
  }),
});

const refreshTokenValidationSchema = z.object({
  cookies: z.object({
    refreshToken: z.string(),
  }),
});

export const AuthValidation = {
  loginValidationSchema,
  refreshTokenValidationSchema,
};
