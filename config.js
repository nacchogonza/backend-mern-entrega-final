import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(process.cwd(), process.env.NODE_ENV + ".env"),
});

export default {
  NODE_ENV: process.env.NODE_ENV || "development",
  PERSISTENCE: process.env.PERSISTENCE || "Mem",
  PORT: process.env.PORT || '8080',
  MODE: process.env.MODE || 'FORK',
  SESSION_TIME: process.env.SESSION_TIME || 600000,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || '',
  GMAIL_NODEMAILER_USER: process.env.GMAIL_NODEMAILER_USER || '',
  GMAIL_NODEMAILER_PASS: process.env.GMAIL_NODEMAILER_PASS || '',
  DB_URL: process.env.DB_URL || ''
};
