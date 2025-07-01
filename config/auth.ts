export const AUTH_CONFIG = {
  jwtSecret: process.env.AUTH_JWT_SECRET || "your-dev-secret",
  tokenExpiresIn: "7d", 
};