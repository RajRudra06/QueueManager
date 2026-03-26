const dotenv = require("dotenv");

dotenv.config();

const demoMode = (process.env.DEMO_MODE || "").toLowerCase() === "true" || !process.env.MONGODB_URI;
const jwtSecret = process.env.JWT_SECRET || "dev_jwt_secret_change_me";

if (!process.env.JWT_SECRET) {
  console.warn("[env] JWT_SECRET not set. Using demo fallback secret.");
}

module.exports = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 4000),
  mongodbUri: process.env.MONGODB_URI || "",
  jwtSecret,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  clientOrigin: process.env.CLIENT_ORIGIN || "*",
  demoMode
};
