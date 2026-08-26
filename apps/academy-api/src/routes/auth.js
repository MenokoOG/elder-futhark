import express from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { User } from "../models/User.js";
import { signToken } from "../utils/jwt.js";

export const authRouter = express.Router();

const CredsSchema = z.object({
  email: z.string().trim().toLowerCase().email("Email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

function validateCreds(email, password) {
  const parsed = CredsSchema.safeParse({ email, password });
  if (!parsed.success) {
    const message = parsed.error.issues?.[0]?.message || "Invalid input";
    return { ok: false, message };
  }
  return { ok: true, email: parsed.data.email, password: parsed.data.password };
}

authRouter.post("/signup", async (req, res) => {
  try {
    const v = validateCreds(req.body?.email, req.body?.password);
    if (!v.ok) return res.status(400).json({ message: v.message });

    const exists = await User.findOne({ email: v.email }).lean();
    if (exists) return res.status(400).json({ message: "Email already in use" });

    const passwordHash = await bcrypt.hash(v.password, 10);
    const user = await User.create({ email: v.email, passwordHash });

    const token = signToken(user);
    return res.json({ token, user: { id: String(user._id), email: user.email } });
  } catch (e) {
    console.error("[auth/signup]", e);
    return res.status(500).json({ message: "Server error" });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const v = validateCreds(req.body?.email, req.body?.password);
    if (!v.ok) return res.status(400).json({ message: v.message });

    const user = await User.findOne({ email: v.email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(v.password, user.passwordHash);
    if (!ok) return res.status(400).json({ message: "Invalid credentials" });

    const token = signToken(user);
    return res.json({ token, user: { id: String(user._id), email: user.email } });
  } catch (e) {
    console.error("[auth/login]", e);
    return res.status(500).json({ message: "Server error" });
  }
});
