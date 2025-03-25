import { createAuthClient } from "better-auth/vue"

// Create an auth client to be able to interact with the auth API of better auth
export const authClient = createAuthClient({
    baseURL: "http://localhost:3000"
})