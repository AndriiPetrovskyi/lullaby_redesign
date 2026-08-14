import "dotenv/config";

export const env = {
  port: process.env.PORT || 3000,
  databaseUrl: process.env.DATABASE_URL,
  baseUrl: process.env.BASE_URL || `http://localhost:${process.env.PORT || 3000}`,
};
