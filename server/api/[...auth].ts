import { auth } from "~/lib/auth";

export default defineEventHandler(async (event) => {
  try {
    return await auth.handler(toWebRequest(event));
  } catch (error) {
    console.error("🔥 Better Auth Handler Error:", error);
    throw error;
  }
});
