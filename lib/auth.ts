import { betterAuth } from "better-auth";
import Database from "better-sqlite3";

// Create a new database connection
const db = new Database("./chinook.sqlite", {
  verbose: console.log,
});

const settings = {
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: [
    "http://localhost:3000",
    "https://playlist-maker-production.up.railway.app",
  ],
  database: db,
};

export const auth = betterAuth(settings);

