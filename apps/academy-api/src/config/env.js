import dotenv from "dotenv";
dotenv.config();

export const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT || 4000),
  MONGODB_URI: process.env.MONGODB_URI || "",
  JWT_SECRET: process.env.JWT_SECRET || "",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
  CLIENT_ORIGIN: (process.env.CLIENT_ORIGIN || "").split(",").map(s => s.trim()).filter(Boolean),
};

export function assertEnv() {
  const missing = [];
  if (!env.MONGODB_URI) missing.push("MONGODB_URI");
  if (!env.JWT_SECRET) missing.push("JWT_SECRET");
  if (missing.length) throw new Error(`Missing required env vars: ${missing.join(", ")}`);
}
