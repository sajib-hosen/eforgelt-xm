// import dotenv from "dotenv";
// import path from "path";

// dotenv.config({ path: path.join(process.cwd(), ".env") });

// export default {
//   node_env: process.env.NODE_ENV,
//   port: process.env.PORT,
//   database_url: process.env.DATABASE_URL,
//   bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS || "10",
//   jwt_access_secret: process.env.JWT_ACCESS_SECRET,
//   jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
//   email_user: process.env.EMAIL_USER,
//   email_pass: process.env.EMAIL_PASS,
//   frontend_url: process.env.FRONTEND_URL,
// };

import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const environment = {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  db_url: process.env.DB_URL,
  jwt_secret: process.env.JWT_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  smtp_host: process.env.SMTP_HOST,
  smtp_port: process.env.SMTP_PORT,
  smtp_secure: process.env.SMTP_SECURE === "true", // convert to boolean
  smtp_user: process.env.SMTP_USER,
  smtp_pass: process.env.SMTP_PASS,
  smtp_from_name: process.env.SMTP_FROM_NAME,
  smtp_from_email: process.env.SMTP_FROM_EMAIL,
  client_base_url: process.env.CLIENT_BASE_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS || "10",
};

export default environment;
