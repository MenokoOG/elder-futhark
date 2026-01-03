import { z } from "zod";

export const EmailSchema = z.string().email();
export const PasswordSchema = z.string().min(8).max(128);

export const SignupSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
  handle: z.string().min(2).max(32)
});
export type SignupDTO = z.infer<typeof SignupSchema>;

export const LoginSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema
});
export type LoginDTO = z.infer<typeof LoginSchema>;

export const AuthResponseSchema = z.object({
  token: z.string().min(1)
});
export type AuthResponseDTO = z.infer<typeof AuthResponseSchema>;