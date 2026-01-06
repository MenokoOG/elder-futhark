import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export const SignupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  // handle is optional on signup; backend will derive a safe handle if omitted
  handle: z.string().min(2).max(30).regex(/^[a-zA-Z0-9._-]+$/).optional()
});

export type LoginDto = z.infer<typeof LoginSchema>;
export type SignupDto = z.infer<typeof SignupSchema>;