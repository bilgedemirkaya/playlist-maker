import { createAuthClient } from "better-auth/vue"

// Create an auth client to be able to interact with the auth API of better auth
export const authClient = createAuthClient({
    baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
    credentials: "include", 
  });
