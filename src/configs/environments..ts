require("dotenv").config();

export const env = {
  MONGODB_URI: process.env.MONGODB_URI,
  HOST: process.env.HOST,
  PORT: process.env.PORT,
  TOKEN_URL: process.env.TOKEN_URL || "",
  CLIENT_ID: process.env.CLIENT_ID || "",
  CLIENT_SECRET: process.env.CLIENT_SECRET || "",
  GRANT_TYPE: process.env.GRANT_TYPE || "",
  PLAYLIST_URL: process.env.PLAYLIST_URL || ""
};
